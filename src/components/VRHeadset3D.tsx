import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface VRHeadsetProps {
  scale?: number
  position?: [number, number, number]
  autoRotate?: boolean
}

function VRHeadsetModel({ scale = 1, position = [0, 0, 0], autoRotate = true }: VRHeadsetProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  // Create VR headset geometry
  const headsetGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Main headset body
    const bodyGeometry = new THREE.BoxGeometry(2, 1, 1.5)
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#1a1a1a'),
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 0.8,
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    group.add(body)
    
    // Lens covers
    const lensGeometry = new THREE.CircleGeometry(0.3, 32)
    const lensMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#A700F5'),
      emissive: new THREE.Color('#A700F5'),
      emissiveIntensity: 0.3,
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.1,
    })
    
    const leftLens = new THREE.Mesh(lensGeometry, lensMaterial)
    leftLens.position.set(-0.4, 0, 0.76)
    group.add(leftLens)
    
    const rightLens = new THREE.Mesh(lensGeometry, lensMaterial)
    rightLens.position.set(0.4, 0, 0.76)
    group.add(rightLens)
    
    // Strap
    const strapGeometry = new THREE.CylinderGeometry(0.03, 0.03, 3, 16)
    const strapMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#333333'),
      metalness: 0.2,
      roughness: 0.8,
    })
    const strap = new THREE.Mesh(strapGeometry, strapMaterial)
    strap.rotation.z = Math.PI / 2
    strap.position.set(0, 0.2, -0.5)
    group.add(strap)
    
    return group
  }, [])

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <primitive
        ref={meshRef}
        object={headsetGeometry}
        scale={[scale, scale, scale]}
        position={position}
      />
      <pointLight position={[2, 2, 2]} intensity={0.5} color="#A700F5" />
      <pointLight position={[-2, -2, 2]} intensity={0.3} color="#DF308D" />
    </Float>
  )
}

export default function VRHeadset3D({ 
  scale = 1, 
  position = [0, 0, 0], 
  autoRotate = true,
  className = ""
}: VRHeadsetProps & { className?: string }) {
  return (
    <div className={`${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        <VRHeadsetModel scale={scale} position={position} autoRotate={autoRotate} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}