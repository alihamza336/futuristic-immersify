import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'

const timelineEvents = [
  {
    year: '2020',
    title: 'Foundation',
    description: 'Started with a vision to revolutionize digital experiences',
    icon: '🚀'
  },
  {
    year: '2021',
    title: 'First VR Success',
    description: 'Launched award-winning VR training platform for healthcare',
    icon: '🏆'
  },
  {
    year: '2022',
    title: 'AR Innovation',
    description: 'Pioneered breakthrough AR navigation technology',
    icon: '🔬'
  },
  {
    year: '2023',
    title: 'Gaming Evolution',
    description: 'Released quantum-physics based gaming engine',
    icon: '🎮'
  },
  {
    year: '2024',
    title: 'Future Vision',
    description: 'Leading the next generation of immersive technologies',
    icon: '🌟'
  }
]

const stats = [
  { number: '50+', label: 'Projects Delivered' },
  { number: '100K+', label: 'Users Reached' },
  { number: '25+', label: 'Industry Awards' },
  { number: '99%', label: 'Client Satisfaction' }
]

export default function AboutSection() {
  return (
    <section id="about" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-title brand-gradient mb-6">Our Journey</h2>
          <p className="text-subtitle text-foreground/70 max-w-3xl mx-auto">
            From ambitious startup to industry leader, we've been pushing the boundaries of what's possible
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-orbitron font-bold brand-gradient mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-foreground/70 font-orbitron uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-brand opacity-30" />
          
          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <Card className="card-3d bg-card/50 backdrop-blur-sm border-border/30 p-6 hover:border-brand-primary/50 transition-all duration-500">
                    <div className="text-2xl mb-2">{event.icon}</div>
                    <h3 className="text-xl font-orbitron font-bold brand-gradient mb-2">
                      {event.title}
                    </h3>
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      {event.description}
                    </p>
                  </Card>
                </div>
                
                {/* Timeline node */}
                <div className="relative z-10 w-2/12 flex justify-center">
                  <div className="w-8 h-8 bg-gradient-brand rounded-full flex items-center justify-center shadow-glow">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
                
                <div className={`w-5/12 ${index % 2 === 0 ? 'pl-8' : 'pr-8'}`}>
                  <div className="text-3xl font-orbitron font-bold brand-gradient">
                    {event.year}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vision Statement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <Card className="card-3d bg-card/30 backdrop-blur-sm border-border/30 p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-orbitron font-bold brand-gradient mb-6">
              Our Vision for Tomorrow
            </h3>
            <p className="text-lg text-foreground/80 leading-relaxed">
              We envision a future where the boundaries between digital and physical reality dissolve, 
              creating seamless experiences that enhance human potential and connection. Through cutting-edge 
              AR, VR, and gaming technologies, we're not just building applications—we're crafting the 
              foundation of tomorrow's digital world.
            </p>
          </Card>
        </motion.div>

        {/* Background decorations */}
        <div className="absolute top-1/4 left-10 w-36 h-36 bg-gradient-brand rounded-full opacity-5 animate-floating" />
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-gradient-glow rounded-full opacity-5 animate-floating" style={{ animationDelay: '4s' }} />
      </div>
    </section>
  )
}