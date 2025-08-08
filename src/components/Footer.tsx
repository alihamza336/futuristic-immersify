import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = {
    Services: ['Augmented Reality', 'Virtual Reality', 'Gaming Development', 'Consulting'],
    Company: ['About Us', 'Portfolio', 'Careers', 'Blog'],
    Resources: ['Documentation', 'API', 'Support', 'Community'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR']
  }

  return (
    <footer className="relative bg-card/20 backdrop-blur-sm border-t border-border/30">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-brand rounded-lg flex items-center justify-center">
                  <span className="text-white font-orbitron font-bold">FT</span>
                </div>
                <span className="font-orbitron font-bold text-2xl brand-gradient">
                  FutureTech
                </span>
              </div>
              
              <p className="text-foreground/70 leading-relaxed mb-6 max-w-sm">
                Pioneering the future of immersive digital experiences through cutting-edge 
                AR, VR, and gaming technologies.
              </p>

              <div className="flex space-x-4">
                {['Li', 'Tw', 'Gh', 'Dr'].map((platform, index) => (
                  <motion.a
                    key={platform}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 bg-muted/30 hover:bg-brand-primary/20 border border-border/50 hover:border-brand-primary/50 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-glow"
                  >
                    <span className="text-xs font-orbitron font-medium">
                      {platform}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links], sectionIndex) => (
            <div key={title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              >
                <h4 className="font-orbitron font-bold text-foreground mb-4">{title}</h4>
                <ul className="space-y-3">
                  {links.map((link, linkIndex) => (
                    <motion.li
                      key={link}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: (sectionIndex * 0.1) + (linkIndex * 0.05) }}
                    >
                      <a 
                        href="#" 
                        className="text-foreground/70 hover:text-brand-primary transition-colors duration-300 text-sm font-orbitron relative group"
                      >
                        {link}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-brand transition-all duration-300 group-hover:w-full" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-border/30 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-foreground/60 text-sm font-orbitron">
                © {currentYear} FutureTech Agency. All rights reserved.
              </p>
              <p className="text-foreground/50 text-xs font-orbitron mt-1">
                Building tomorrow's digital experiences today.
              </p>
            </div>
            
            <div className="flex items-center space-x-6 text-xs font-orbitron text-foreground/60">
              <a href="#" className="hover:text-brand-primary transition-colors duration-300">
                Privacy
              </a>
              <a href="#" className="hover:text-brand-primary transition-colors duration-300">
                Terms
              </a>
              <a href="#" className="hover:text-brand-primary transition-colors duration-300">
                Cookies
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-brand rounded-full opacity-5 animate-floating" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-glow rounded-full opacity-5 animate-floating" style={{ animationDelay: '2s' }} />
      </div>
    </footer>
  )
}