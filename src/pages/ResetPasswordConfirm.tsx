import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { FuturisticButton } from '@/components/FuturisticButton'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordConfirm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { updatePassword } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // Check if we have the required URL parameters for password reset
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    
    if (!accessToken || !refreshToken) {
      toast({
        title: "Invalid Reset Link",
        description: "This password reset link is invalid or has expired.",
        variant: "destructive",
      })
      navigate('/reset-password')
    }
  }, [searchParams, navigate, toast])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    const { error } = await updatePassword(password)

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      })
      navigate('/dashboard')
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
        <div className="w-full max-w-md mx-auto">
          <div className="bg-card/20 backdrop-blur-lg border border-border/50 rounded-lg p-8 shadow-brand">
            <div className="text-center mb-8">
              <h1 className="text-title font-orbitron brand-gradient mb-2">
                Set New Password
              </h1>
              <p className="text-muted-foreground">
                Enter your new password below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground font-orbitron"
                    placeholder="Enter your new password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-destructive" role="alert">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground font-orbitron"
                  placeholder="Confirm your new password"
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-destructive" role="alert">{errors.confirmPassword}</p>
                )}
              </div>

              <FuturisticButton
                type="submit"
                variant="hero"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </FuturisticButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}