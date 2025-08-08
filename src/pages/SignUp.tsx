import { AuthForm } from '@/components/AuthForm'
import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 particles gradient-mesh">
      {/* Background effects matching existing design */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5" />
      
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-brand rounded-full opacity-5 blur-3xl floating" />
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-glow rounded-full opacity-10 blur-2xl floating" style={{ animationDelay: '2s' }} />

      <div className="relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
              <span className="text-white font-orbitron font-bold text-sm">FT</span>
            </div>
            <span className="font-orbitron font-bold text-xl brand-gradient">
              FutureTech
            </span>
          </Link>
        </div>

        <AuthForm type="signup" />
      </div>
    </div>
  )
}