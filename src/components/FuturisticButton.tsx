import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface FuturisticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  glowEffect?: boolean
}

const FuturisticButton = forwardRef<HTMLButtonElement, FuturisticButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, glowEffect = false, ...props }, ref) => {
    const baseClasses = 'btn transition-all duration-300 font-orbitron font-medium tracking-wider'
    
    const variantClasses = {
      primary: 'btn--primary',
      ghost: 'btn--ghost',
      outline: 'btn--ghost' // Same styling as ghost for now
    }
    
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm h-9',
      md: 'px-6 py-3 text-base h-11',
      lg: 'px-8 py-4 text-lg h-14',
      xl: 'px-12 py-5 text-xl h-16'
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          glowEffect && 'animate-glow-pulse',
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-md" />
      </button>
    )
  }
)

FuturisticButton.displayName = 'FuturisticButton'

export { FuturisticButton }