import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FuturisticButton } from './FuturisticButton'
import heroBackground from '@/assets/hero-bg.jpg'

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current || !parallaxRef.current) return
      
      const rect = sectionRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      
      // Subtle parallax effect (reduced from 3D version)
      const moveX = (x - 0.5) * 20
      const moveY = (y - 0.5) * 20
      
      parallaxRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`
    }

    const handleMouseLeave = () => {
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = 'translate(0px, 0px)'
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden particles gradient-mesh transition-all duration-200"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/10" />
      
      {/* Parallax Background Elements */}
      <div ref={parallaxRef} className="absolute inset-0 parallax-layer">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-brand rounded-full opacity-10 blur-3xl floating" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-glow rounded-full opacity-15 blur-2xl floating" style={{ animationDelay: '2s' }} />
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
            Immersive products, from concept to launch.
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

        {/* Enhanced Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-gradient-brand rounded-full opacity-20 floating" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-1/4 right-20 w-16 h-16 bg-gradient-glow rounded-full opacity-15 floating" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-brand-secondary rounded-full opacity-25 floating" style={{ animationDelay: '4s' }} />
        
        {/* New 2.5D Elements */}
        <div className="absolute top-3/4 right-1/4 w-8 h-8 bg-brand-glow rounded-full opacity-30 floating" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-10 w-6 h-6 bg-gradient-brand rounded-full opacity-20 floating" style={{ animationDelay: '3s' }} />
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className="w-6 h-10 border-2 border-brand-primary/50 rounded-full flex justify-center neon-glow">
          <div className="w-1 h-3 bg-brand-primary rounded-full mt-2 animate-bounce" />
        </div>
        <p className="text-xs text-foreground/60 mt-2 font-orbitron tracking-wider">SCROLL</p>
      </motion.div>
    </section>
  )
}