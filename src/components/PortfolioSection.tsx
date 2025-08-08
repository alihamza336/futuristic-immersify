import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { FuturisticButton } from './FuturisticButton'
import teamFaces from '@/assets/team-faces.jpg'

const projects = [
  {
    title: 'NeuroVR Medical Training',
    category: 'Virtual Reality',
    description: 'Immersive medical training simulation for neurosurgery procedures',
    image: teamFaces,
    tech: ['Unity', 'Oculus SDK', 'C#', 'Medical APIs'],
    status: 'Live'
  },
  {
    title: 'CityAR Navigation',
    category: 'Augmented Reality',
    description: 'Real-time AR navigation and city information overlay system',
    image: teamFaces,
    tech: ['ARCore', 'React Native', 'Computer Vision', 'GPS'],
    status: 'In Development'
  },
  {
    title: 'Quantum Realms',
    category: 'Gaming',
    description: 'Multiplayer sci-fi adventure game with quantum mechanics',
    image: teamFaces,
    tech: ['Unreal Engine', 'Multiplayer', 'Physics', 'AI'],
    status: 'Coming Soon'
  }
]

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-title brand-gradient mb-6">Selected Work</h2>
          <p className="text-subtitle text-foreground/70 max-w-3xl mx-auto">
            Showcasing our latest innovations in immersive technology and interactive experiences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="card-3d bg-card/50 backdrop-blur-sm border-border/30 overflow-hidden h-full hover:border-brand-primary/50 transition-all duration-500">
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* VR Headset Overlay Effect - This is where the headset would "land" on faces */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-brand-primary/90 backdrop-blur-sm rounded-full text-xs font-orbitron font-medium">
                    {project.status}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <span className="text-xs font-orbitron text-brand-primary/80 uppercase tracking-wider">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-orbitron font-bold text-foreground mt-2 mb-3">
                      {project.title}
                    </h3>
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span 
                        key={tech}
                        className="px-2 py-1 bg-muted/50 text-xs font-orbitron text-foreground/80 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <FuturisticButton variant="ghost" size="sm" className="w-full">
                    View Details
                  </FuturisticButton>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-brand opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <FuturisticButton variant="outline" size="lg">
            View All Projects
          </FuturisticButton>
        </motion.div>

        {/* Background decorations */}
        <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-glow rounded-full opacity-5 animate-floating" />
        <div className="absolute bottom-40 left-20 w-28 h-28 bg-gradient-brand rounded-full opacity-5 animate-floating" style={{ animationDelay: '2s' }} />
      </div>
    </section>
  )
}