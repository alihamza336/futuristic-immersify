import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import VRHeadset3D from './VRHeadset3D'
import { FuturisticButton } from './FuturisticButton'
import heroBackground from '@/assets/hero-bg.jpg'

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return
      
      const rect = sectionRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      
      const rotateX = (y - 0.5) * 5
      const rotateY = (x - 0.5) * 5
      
      sectionRef.current.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`
    }

    const handleMouseLeave = () => {
      if (sectionRef.current) {
        sectionRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
      }
    }

    const section = sectionRef.current
    if (section) {
      section.addEventListener('mousemove', handleMouseMove)
      section.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (section) {
        section.removeEventListener('mousemove', handleMouseMove)
        section.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden particles transition-transform duration-200"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/10" />
      
      {/* 3D VR Headset */}
      <div className="absolute top-20 right-10 w-96 h-96 opacity-60 floating">
        <VRHeadset3D scale={0.8} autoRotate={true} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-hero brand-gradient glow-text mb-6">
            We Build AR • VR • Gaming Futures
          </h1>
          
          <motion.p 
            className="text-subtitle text-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Immersive digital experiences that push the boundaries of reality. 
            From cutting-edge AR applications to mind-bending VR worlds and next-generation gaming.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <FuturisticButton variant="hero" size="xl" glowEffect>
              Explore Our Worlds
            </FuturisticButton>
            <FuturisticButton variant="outline" size="xl">
              View Portfolio
            </FuturisticButton>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-gradient-brand rounded-full opacity-20 animate-floating" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-1/4 right-20 w-16 h-16 bg-gradient-glow rounded-full opacity-15 animate-floating" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-brand-secondary rounded-full opacity-25 animate-floating" style={{ animationDelay: '4s' }} />
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className="w-6 h-10 border-2 border-brand-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-brand-primary rounded-full mt-2 animate-bounce" />
        </div>
        <p className="text-xs text-foreground/60 mt-2 font-orbitron">SCROLL</p>
      </motion.div>
    </section>
  )
}