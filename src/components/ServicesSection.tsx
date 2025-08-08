import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { FuturisticButton } from './FuturisticButton'

const services = [
  {
    title: 'Augmented Reality',
    description: 'AR that blends digital with reality—prototypes to production.',
    icon: '🥽',
    features: ['Mobile AR Apps', 'Web AR Solutions', 'Industrial AR', 'Social AR Filters'],
    color: 'from-brand-primary to-brand-secondary'
  },
  {
    title: 'Virtual Reality',
    description: 'VR experiences with presence, performance, and polish.',
    icon: '🌐',
    features: ['VR Games', 'Training Simulations', 'Virtual Tours', 'VR Therapy'],
    color: 'from-brand-secondary to-brand-glow'
  },
  {
    title: 'Gaming Development',
    description: 'Playable worlds, rapid iteration, and live-ops ready.',
    icon: '🎮',
    features: ['Mobile Games', 'PC/Console', 'Multiplayer', 'Game Engines'],
    color: 'from-brand-glow to-brand-primary'
  }
]

export default function ServicesSection() {
  return (
    <section id="services" className="py-32 relative gradient-mesh">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-title brand-gradient mb-6">Our Expertise</h2>
          <p className="text-subtitle text-foreground/70 max-w-3xl mx-auto">
            We specialize in creating cutting-edge digital experiences across three revolutionary technologies
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="card-3d bg-card/50 backdrop-blur-sm border-border/30 p-8 h-full hover:border-brand-primary/50 transition-all duration-500 neon-glow">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  {/* ALWAYS VISIBLE TITLE */}
                  <h3 className="text-2xl font-orbitron font-bold brand-gradient mb-4 opacity-100">
                    {service.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed opacity-100">
                    {service.description}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (index * 0.2) + (featureIndex * 0.1) }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-2 h-2 bg-gradient-brand rounded-full" />
                      <span className="text-sm text-foreground/80 font-orbitron opacity-100">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Service CTA */}
                <div className="mt-auto">
                  <FuturisticButton variant="ghost" size="sm" className="w-full">
                    Learn More
                  </FuturisticButton>
                </div>

                {/* Hover effect overlay - DOES NOT HIDE TEXT */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-lg pointer-events-none`} />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Background decorations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-brand rounded-full opacity-5 floating" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-glow rounded-full opacity-5 floating" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-brand-secondary rounded-full opacity-10 floating" style={{ animationDelay: '1.5s' }} />
      </div>
    </section>
  )
}