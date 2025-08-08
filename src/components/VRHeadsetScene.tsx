import { useRef, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'
import { useWebGLSupported, usePrefersReducedMotion, usePerformanceClamp } from '../hooks/useWebGL'

interface VRHeadsetModelProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  autoRotate?: boolean
}

export interface VRHeadsetSceneRef {
  animateToPosition: (position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]) => void
  getCurrentPosition: () => THREE.Vector3
}

function VRHeadsetModel({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], autoRotate = true }: VRHeadsetModelProps) {
  const meshRef = useRef<THREE.Group>(null!)
  const prefersReduced = usePrefersReducedMotion()
  
  // Create a procedural VR headset since GLTF might not be available
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
    
    // Lens covers with brand colors
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

  useFrame((state) => {
    if (!prefersReduced && autoRotate && meshRef.current) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <Float speed={prefersReduced ? 0 : 2} rotationIntensity={prefersReduced ? 0 : 0.5} floatIntensity={prefersReduced ? 0 : 1}>
      <primitive
        ref={meshRef}
        object={headsetGeometry}
        position={position}
        rotation={rotation}
        scale={scale}
      />
      <pointLight position={[2, 2, 2]} intensity={0.5} color="#A700F5" />
      <pointLight position={[-2, -2, 2]} intensity={0.3} color="#DF308D" />
    </Float>
  )
}

const VRHeadsetScene = forwardRef<VRHeadsetSceneRef, { className?: string; showControls?: boolean }>(
  ({ className = "", showControls = false }, ref) => {
    const isWebGLSupported = useWebGLSupported()
    const prefersReduced = usePrefersReducedMotion()
    const shouldClamp = usePerformanceClamp()
    const headsetRef = useRef<THREE.Group>(null)

    useImperativeHandle(ref, () => ({
      animateToPosition: (newPosition, newRotation, newScale) => {
        if (headsetRef.current) {
          // This would be implemented with GSAP in production
          headsetRef.current.position.set(...newPosition)
          headsetRef.current.rotation.set(...newRotation)
          headsetRef.current.scale.set(...newScale)
        }
      },
      getCurrentPosition: () => {
        return headsetRef.current?.position || new THREE.Vector3(0, 0, 0)
      }
    }), [])

    if (!isWebGLSupported) {
      return (
        <div className={`webgl-fallback ${className}`}>
          <div>
            <h3 className="text-lg font-semibold mb-2">VR Headset</h3>
            <p className="text-sm text-muted-foreground">WebGL not supported. Showing fallback image.</p>
          </div>
        </div>
      )
    }

    return (
      <div className={`webgl-container ${className}`}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ 
            alpha: true, 
            antialias: !shouldClamp,
            powerPreference: shouldClamp ? 'low-power' : 'default'
          }}
          dpr={shouldClamp ? 1 : [1, 2]}
        >
          <color attach="background" args={['transparent']} />
          
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={0.5} />
          
          {/* Environment */}
          <Environment preset="city" />
          
          {/* VR Headset Model */}
          <VRHeadsetModel autoRotate={!prefersReduced} />
          
          {/* Controls */}
          {showControls && <OrbitControls enableZoom={false} enablePan={false} />}
          
          {/* Post-processing would go here with proper postprocessing library */}
        </Canvas>
      </div>
    )
  }
)

VRHeadsetScene.displayName = 'VRHeadsetScene'

export default VRHeadsetScene