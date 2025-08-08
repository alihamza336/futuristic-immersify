import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { FuturisticButton } from './FuturisticButton'
import { ChevronDown, User, LogOut, Settings } from 'lucide-react'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'nav-glow backdrop-blur-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
              <span className="text-white font-orbitron font-bold text-sm">FT</span>
            </div>
            <span className="font-orbitron font-bold text-xl brand-gradient">
              FutureTech
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="font-orbitron text-sm font-medium text-foreground/80 hover:text-brand-primary transition-colors duration-300 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-brand transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:block">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary/20 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-brand rounded-full flex items-center justify-center">
                    <span className="text-white font-orbitron font-bold text-sm">
                      {user.email?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-foreground transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border/50 rounded-lg shadow-brand backdrop-blur-lg z-50">
                    <div className="p-3 border-b border-border/50">
                      <p className="text-sm font-orbitron text-foreground truncate">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-secondary/20 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={() => {
                          signOut()
                          setShowUserMenu(false)
                        }}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-secondary/20 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/signin">
                  <FuturisticButton variant="outline" size="sm">
                    Sign In
                  </FuturisticButton>
                </Link>
                <Link to="/signup">
                  <FuturisticButton variant="hero" size="sm">
                    Get Started
                  </FuturisticButton>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-foreground p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}