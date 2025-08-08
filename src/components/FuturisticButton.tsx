import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const futuristicButtonVariants = cva(
  "btn relative overflow-hidden font-orbitron font-medium tracking-wider transition-all duration-300 transform hover:scale-105 neon-glow",
  {
    variants: {
      variant: {
        hero: "btn--primary text-white",
        outline: "btn--ghost text-brand-primary",
        ghost: "text-brand-primary hover:bg-brand-primary/10 hover:text-brand-glow border-brand-primary/50",
        glow: "btn--primary text-white shadow-glow hover:shadow-brand animate-glow-pulse",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-9 px-6 text-sm",
        lg: "h-14 px-12 text-lg",
        xl: "h-16 px-16 text-xl",
      },
    },
    defaultVariants: {
      variant: "hero",
      size: "default",
    },
  }
)

export interface FuturisticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof futuristicButtonVariants> {
  children: React.ReactNode
  glowEffect?: boolean
}

export function FuturisticButton({
  className,
  variant,
  size,
  children,
  glowEffect = false,
  ...props
}: FuturisticButtonProps) {
  return (
    <button
      className={cn(
        futuristicButtonVariants({ variant, size }),
        glowEffect && "animate-glow-pulse",
        className
      )}
      {...props}
    >
      {/* ALWAYS VISIBLE TEXT - CRITICAL FOR ACCESSIBILITY */}
      <span className="relative z-10 font-medium text-inherit opacity-100">
        {children}
      </span>
      
      {/* Animated background effect - DOES NOT HIDE TEXT */}
      <div className="absolute inset-0 bg-gradient-brand opacity-0 transition-opacity duration-300 hover:opacity-10 -z-10" />
    </button>
  )
}