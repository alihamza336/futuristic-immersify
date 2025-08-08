import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { FuturisticButton } from './FuturisticButton'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, Github } from 'lucide-react'

interface AuthFormProps {
  type: 'signin' | 'signup'
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { signUp, signIn, signInWithGitHub } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const isSignUp = type === 'signup'

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (isSignUp) {
      if (!displayName.trim()) {
        newErrors.displayName = 'Display name is required'
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      let result
      if (isSignUp) {
        result = await signUp(email, password, displayName)
        if (!result.error) {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
          })
          navigate('/signin')
          return
        }
      } else {
        result = await signIn(email, password)
        if (!result.error) {
          const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard'
          sessionStorage.removeItem('redirectAfterLogin')
          navigate(redirectPath)
          return
        }
      }

      if (result.error) {
        toast({
          title: "Authentication Error",
          description: result.error.message,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubSignIn = async () => {
    setLoading(true)
    const { error } = await signInWithGitHub()
    
    if (error) {
      toast({
        title: "GitHub Sign In Error",
        description: error.message,
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card/20 backdrop-blur-lg border border-border/50 rounded-lg p-8 shadow-brand">
        <div className="text-center mb-8">
          <h1 className="text-title font-orbitron brand-gradient mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? 'Join the future of immersive tech' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-foreground mb-2">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground font-orbitron"
                placeholder="Enter your display name"
                disabled={loading}
              />
              {errors.displayName && (
                <p className="mt-1 text-sm text-destructive" role="alert">{errors.displayName}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground font-orbitron"
              placeholder="Enter your email"
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive" role="alert">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground font-orbitron"
                placeholder="Enter your password"
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

          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground font-orbitron"
                placeholder="Confirm your password"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-destructive" role="alert">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          <FuturisticButton
            type="submit"
            variant="hero"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </FuturisticButton>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGitHubSignIn}
            disabled={loading}
            className="w-full mt-4 px-4 py-3 bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-colors flex items-center justify-center gap-3 text-foreground font-orbitron font-medium disabled:opacity-50"
          >
            <Github size={20} />
            GitHub
          </button>
        </div>

        <div className="mt-6 text-center space-y-2">
          {!isSignUp && (
            <Link
              to="/reset-password"
              className="block text-sm text-brand-primary hover:text-brand-glow transition-colors font-orbitron"
            >
              Forgot your password?
            </Link>
          )}
          
          <p className="text-sm text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link
              to={isSignUp ? '/signin' : '/signup'}
              className="text-brand-primary hover:text-brand-glow transition-colors font-orbitron font-medium"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}