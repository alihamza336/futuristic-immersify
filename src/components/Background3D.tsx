import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Configuration
const CONFIG = {
  headsetModelUrl: '/models/vr-headset.glb', // Placeholder - replace with actual model
  hdrEnvUrl: '/hdri/studio.hdr', // Placeholder - replace with actual HDRI
  particleDensity: 100,
  performance: {
    targetFPS: 60,
    lowPowerFPS: 30,
    maxDPR: 2
  }
}

export default function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    composer: EffectComposer
    headset: THREE.Object3D | null
    particles: THREE.Points | null
    isReducedMotion: boolean
    cleanup: () => void
  } | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    let animationId: number
    let isDisposed = false

    const initBackground3D = async () => {
      try {
        // Check WebGL support
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        if (!gl) {
          showFallbackBackground()
          return
        }

        // Scene setup
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
          50,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        )
        
        const renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current!,
          antialias: false, // SMAA will handle this
          alpha: true,
          powerPreference: 'high-performance'
        })
        
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, CONFIG.performance.maxDPR))
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1

        // Post-processing
        const composer = new EffectComposer(renderer)
        const renderPass = new RenderPass(scene, camera)
        composer.addPass(renderPass)

        // Bloom pass (subtle)
        const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          0.3, // strength
          0.4, // radius
          0.85 // threshold
        )
        composer.addPass(bloomPass)

        // Anti-aliasing
        const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight)
        composer.addPass(smaaPass)

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.position.set(5, 5, 5)
        directionalLight.castShadow = true
        scene.add(directionalLight)

        // Brand color accent light
        const accentLight = new THREE.PointLight(0xa700f5, 0.6, 20)
        accentLight.position.set(-5, 0, 5)
        scene.add(accentLight)

        // Camera positioning
        camera.position.set(0, 0, 8)

        // Create procedural VR headset (fallback if no GLTF model)
        const headset = createProceduralHeadset()
        scene.add(headset)

        // Atmosphere particles
        const particles = createAtmosphere()
        scene.add(particles)

        // Store references
        sceneRef.current = {
          scene,
          camera,
          renderer,
          composer,
          headset,
          particles,
          isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          cleanup: () => {
            isDisposed = true
            if (animationId) cancelAnimationFrame(animationId)
            
            // Dispose resources
            scene.traverse((obj) => {
              if (obj instanceof THREE.Mesh) {
                obj.geometry?.dispose()
                if (Array.isArray(obj.material)) {
                  obj.material.forEach(mat => mat.dispose())
                } else {
                  obj.material?.dispose()
                }
              }
            })
            
            renderer.dispose()
            composer.dispose()
            
            // Clear ScrollTrigger
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
          }
        }

        // Setup scroll synchronization
        setupScrollSync()

        // Animation loop
        const animate = () => {
          if (isDisposed) return
          
          animationId = requestAnimationFrame(animate)
          
          // Idle animations
          if (!sceneRef.current?.isReducedMotion) {
            const time = Date.now() * 0.001
            
            // Headset idle animation
            if (headset) {
              headset.rotation.y = Math.sin(time * 0.5) * 0.1
              headset.position.y = Math.sin(time * 0.3) * 0.2
            }
            
            // Particle rotation
            if (particles) {
              particles.rotation.y = time * 0.05
            }
          }
          
          composer.render()
        }

        animate()

        // Handle resize
        const handleResize = () => {
          if (isDisposed) return
          
          const width = window.innerWidth
          const height = window.innerHeight
          
          camera.aspect = width / height
          camera.updateProjectionMatrix()
          
          renderer.setSize(width, height)
          composer.setSize(width, height)
        }

        window.addEventListener('resize', handleResize)
        
        // Load actual GLTF model if available
        try {
          await loadHeadsetModel(CONFIG.headsetModelUrl, scene, headset)
        } catch (error) {
          console.log('Using procedural headset model as fallback')
        }

      } catch (error) {
        console.error('3D Background initialization failed:', error)
        showFallbackBackground()
      }
    }

    const createProceduralHeadset = (): THREE.Group => {
      const group = new THREE.Group()
      
      // Main headset body
      const bodyGeometry = new THREE.BoxGeometry(2, 1.2, 1.5)
      const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x222222,
        metalness: 0.7,
        roughness: 0.3,
        clearcoat: 0.5
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      group.add(body)
      
      // Lenses
      const lensGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16)
      const lensMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.8,
        thickness: 0.5
      })
      
      const leftLens = new THREE.Mesh(lensGeometry, lensMaterial)
      leftLens.position.set(-0.4, 0, 0.7)
      leftLens.rotation.x = Math.PI / 2
      group.add(leftLens)
      
      const rightLens = new THREE.Mesh(lensGeometry, lensMaterial)
      rightLens.position.set(0.4, 0, 0.7)
      rightLens.rotation.x = Math.PI / 2
      group.add(rightLens)
      
      // Strap
      const strapGeometry = new THREE.TorusGeometry(1.5, 0.1, 8, 16, Math.PI)
      const strapMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x333333,
        roughness: 0.8
      })
      const strap = new THREE.Mesh(strapGeometry, strapMaterial)
      strap.rotation.y = Math.PI
      group.add(strap)
      
      // Brand accent glow
      const glowGeometry = new THREE.RingGeometry(0.1, 0.2, 16)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xa700f5,
        transparent: true,
        opacity: 0.6
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      glow.position.set(0, 0.3, 0.7)
      group.add(glow)
      
      group.scale.setScalar(0.8)
      group.position.set(2, 0, -3)
      
      return group
    }

    const createAtmosphere = (): THREE.Points => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(CONFIG.particleDensity * 3)
      const colors = new Float32Array(CONFIG.particleDensity * 3)
      
      const brandColor1 = new THREE.Color(0xa700f5)
      const brandColor2 = new THREE.Color(0xdf308d)
      
      for (let i = 0; i < CONFIG.particleDensity; i++) {
        const i3 = i * 3
        
        // Distribute particles in a sphere around the scene
        const radius = 15 + Math.random() * 10
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i3 + 1] = radius * Math.cos(phi)
        positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
        
        // Mix brand colors
        const color = brandColor1.clone().lerp(brandColor2, Math.random())
        colors[i3] = color.r
        colors[i3 + 1] = color.g
        colors[i3 + 2] = color.b
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      
      const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      })
      
      return new THREE.Points(geometry, material)
    }

    const loadHeadsetModel = async (url: string, scene: THREE.Scene, currentHeadset: THREE.Object3D) => {
      const loader = new GLTFLoader()
      
      // Setup DRACO decoder
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/draco/')
      loader.setDRACOLoader(dracoLoader)
      
      const gltf = await loader.loadAsync(url)
      
      // Remove procedural headset and add GLTF model
      scene.remove(currentHeadset)
      
      const model = gltf.scene
      model.scale.setScalar(0.5)
      model.position.set(2, 0, -3)
      
      scene.add(model)
      
      if (sceneRef.current) {
        sceneRef.current.headset = model
      }
    }

    const setupScrollSync = () => {
      if (!sceneRef.current) return
      
      const { headset, camera, isReducedMotion } = sceneRef.current
      
      if (isReducedMotion) return
      
      // Main scroll follow animation
      ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          
          if (headset) {
            // Drift down with scroll
            headset.position.y = -progress * 8
            headset.position.x = 2 + Math.sin(progress * Math.PI) * 1
            headset.rotation.z = progress * 0.3
            
            // Scale slightly smaller as it drifts away
            const scale = 0.8 - progress * 0.2
            headset.scale.setScalar(Math.max(scale, 0.4))
          }
          
          // Camera subtle drift
          camera.position.x = Math.sin(progress * Math.PI * 2) * 0.5
        }
      })
      
      // Section-based pose changes
      const sections = ['#home', '#services', '#portfolio', '#about', '#contact']
      
      sections.forEach((selector, index) => {
        ScrollTrigger.create({
          trigger: selector,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => {
            if (!headset || isReducedMotion) return
            
            // Different poses for different sections
            gsap.to(headset.rotation, {
              duration: 1,
              y: (index - 2) * 0.2,
              ease: 'power2.inOut'
            })
            
            // Subtle glow pulse on section enter
            if (sceneRef.current?.scene) {
              const accentLight = sceneRef.current.scene.children.find(
                child => child instanceof THREE.PointLight && child.color.getHex() === 0xa700f5
              ) as THREE.PointLight
              
              if (accentLight) {
                gsap.to(accentLight, {
                  intensity: 1.2,
                  duration: 0.5,
                  yoyo: true,
                  repeat: 1,
                  ease: 'power2.inOut'
                })
              }
            }
          }
        })
      })
    }

    const showFallbackBackground = () => {
      if (canvasRef.current) {
        canvasRef.current.style.display = 'none'
        
        // Show fallback background image
        const fallback = document.createElement('div')
        fallback.id = 'bg3d-fallback'
        fallback.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: -1;
          background: linear-gradient(135deg, #000000 0%, #1a0033 50%, #000000 100%);
          pointer-events: none;
        `
        document.body.appendChild(fallback)
      }
    }

    // Check for reduced motion preference
    const handleMotionPreference = (e: MediaQueryListEvent) => {
      if (sceneRef.current) {
        sceneRef.current.isReducedMotion = e.matches
        if (e.matches) {
          // Disable heavy animations
          ScrollTrigger.getAll().forEach(trigger => trigger.disable())
        } else {
          ScrollTrigger.getAll().forEach(trigger => trigger.enable())
        }
      }
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    motionQuery.addEventListener('change', handleMotionPreference)

    // Initialize
    initBackground3D()

    // Cleanup
    return () => {
      isDisposed = true
      motionQuery.removeEventListener('change', handleMotionPreference)
      
      if (sceneRef.current) {
        sceneRef.current.cleanup()
      }
      
      // Remove fallback if exists
      const fallback = document.getElementById('bg3d-fallback')
      if (fallback) {
        fallback.remove()
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="bg3d"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  )
}