import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FuturisticButton } from './FuturisticButton'

const contactMethods = [
  {
    icon: '📧',
    title: 'Email',
    detail: 'hello@futuretech.agency',
    description: 'Drop us a line anytime'
  },
  {
    icon: '📱',
    title: 'Phone',
    detail: '+1 (555) 123-TECH',
    description: 'Call us during business hours'
  },
  {
    icon: '📍',
    title: 'Location',
    detail: 'San Francisco, CA',
    description: 'Visit our innovation hub'
  },
  {
    icon: '💬',
    title: 'Live Chat',
    detail: 'Available 24/7',
    description: 'Instant support online'
  }
]

export default function ContactSection() {
  return (
    <section id="contact" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-title brand-gradient mb-6">Let's Build the Future Together</h2>
          <p className="text-subtitle text-foreground/70 max-w-3xl mx-auto">
            Ready to transform your vision into immersive reality? Get in touch and let's create something extraordinary.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="card-3d bg-card/50 backdrop-blur-sm border-border/30 p-8">
              <h3 className="text-2xl font-orbitron font-bold brand-gradient mb-8">
                Start Your Project
              </h3>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-orbitron text-foreground/80">Name</label>
                    <Input 
                      className="bg-muted/30 border-border/50 focus:border-brand-primary/50 font-orbitron"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-orbitron text-foreground/80">Email</label>
                    <Input 
                      type="email"
                      className="bg-muted/30 border-border/50 focus:border-brand-primary/50 font-orbitron"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-orbitron text-foreground/80">Project Type</label>
                  <select className="w-full p-3 bg-muted/30 border border-border/50 rounded-md focus:border-brand-primary/50 font-orbitron text-foreground">
                    <option value="">Select a service</option>
                    <option value="ar">Augmented Reality</option>
                    <option value="vr">Virtual Reality</option>
                    <option value="gaming">Gaming Development</option>
                    <option value="consulting">Consulting</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-orbitron text-foreground/80">Budget Range</label>
                  <select className="w-full p-3 bg-muted/30 border border-border/50 rounded-md focus:border-brand-primary/50 font-orbitron text-foreground">
                    <option value="">Select budget range</option>
                    <option value="10k-25k">$10K - $25K</option>
                    <option value="25k-50k">$25K - $50K</option>
                    <option value="50k-100k">$50K - $100K</option>
                    <option value="100k+">$100K+</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-orbitron text-foreground/80">Project Details</label>
                  <Textarea 
                    className="bg-muted/30 border-border/50 focus:border-brand-primary/50 font-orbitron min-h-32"
                    placeholder="Tell us about your vision, goals, and requirements..."
                  />
                </div>

                <FuturisticButton variant="primary" size="lg" className="w-full" glowEffect>
                  Launch Project
                </FuturisticButton>
              </form>
            </Card>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-orbitron font-bold brand-gradient mb-8">
                Get In Touch
              </h3>
              <p className="text-foreground/70 leading-relaxed mb-8">
                Whether you have a fully formed concept or just an idea, we're here to help bring your 
                vision to life. Our team of experts is ready to discuss your project and provide insights 
                on the latest immersive technologies.
              </p>
            </div>

            <div className="grid gap-6">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="card-3d bg-card/30 backdrop-blur-sm border-border/30 p-6 hover:border-brand-primary/50 transition-all duration-500">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{method.icon}</div>
                      <div>
                        <h4 className="font-orbitron font-bold text-foreground mb-1">
                          {method.title}
                        </h4>
                        <p className="text-brand-primary font-orbitron font-medium mb-1">
                          {method.detail}
                        </p>
                        <p className="text-sm text-foreground/70">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h4 className="font-orbitron font-bold text-foreground mb-4">Follow Our Journey</h4>
              <div className="flex space-x-4">
                {['LinkedIn', 'Twitter', 'GitHub', 'Dribbble'].map((platform) => (
                  <a
                    key={platform}
                    href="#"
                    className="w-12 h-12 bg-muted/30 hover:bg-brand-primary/20 border border-border/50 hover:border-brand-primary/50 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-glow"
                  >
                    <span className="text-sm font-orbitron font-medium">
                      {platform.charAt(0)}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Background decorations */}
        <div className="absolute top-20 right-20 w-48 h-48 bg-gradient-brand rounded-full opacity-5 animate-floating" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-glow rounded-full opacity-5 animate-floating" style={{ animationDelay: '3s' }} />
      </div>
    </section>
  )
}