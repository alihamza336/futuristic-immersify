import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { FuturisticButton } from '@/components/FuturisticButton'
import { useToast } from '@/hooks/use-toast'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { resetPassword } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    const { error } = await resetPassword(email)

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setSent(true)
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 particles gradient-mesh">
      {/* Background effects matching existing design */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5" />
      
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-brand rounded-full opacity-5 blur-3xl floating" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-glow rounded-full opacity-10 blur-2xl floating" style={{ animationDelay: '2s' }} />

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

        <div className="w-full max-w-md mx-auto">
          <div className="bg-card/20 backdrop-blur-lg border border-border/50 rounded-lg p-8 shadow-brand">
            <div className="text-center mb-8">
              <h1 className="text-title font-orbitron brand-gradient mb-2">
                Reset Password
              </h1>
              <p className="text-muted-foreground">
                {sent ? 'Check your email for reset instructions' : 'Enter your email to reset your password'}
              </p>
            </div>

            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground font-orbitron"
                    placeholder="Enter your email"
                    disabled={loading}
                    required
                  />
                </div>

                <FuturisticButton
                  type="submit"
                  variant="hero"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Email'}
                </FuturisticButton>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-foreground">
                  If an account with that email exists, you'll receive password reset instructions.
                </p>
                <FuturisticButton
                  onClick={() => setSent(false)}
                  variant="outline"
                  className="w-full"
                >
                  Send Another Email
                </FuturisticButton>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link
                to="/signin"
                className="text-sm text-brand-primary hover:text-brand-glow transition-colors font-orbitron"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}