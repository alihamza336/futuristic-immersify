import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const futuristicButtonVariants = cva(
  "relative overflow-hidden font-orbitron font-medium tracking-wider transition-all duration-300 transform hover:scale-105",
  {
    variants: {
      variant: {
        hero: "bg-gradient-brand hover:shadow-glow border border-brand-primary/30 text-white hover:border-brand-primary",
        outline: "border-2 border-brand-primary/50 text-brand-primary hover:bg-brand-primary hover:text-white hover:shadow-glow",
        ghost: "text-brand-primary hover:bg-brand-primary/10 hover:text-brand-glow",
        glow: "bg-brand-primary text-white shadow-glow hover:shadow-brand animate-glow-pulse",
      },
      size: {
        default: "h-12 px-8 py-2",
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
    <Button
      className={cn(
        futuristicButtonVariants({ variant, size }),
        glowEffect && "animate-glow-pulse",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-brand opacity-0 transition-opacity duration-300 hover:opacity-20" />
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-brand blur-md opacity-0 transition-opacity duration-300 hover:opacity-30 -z-10" />
    </Button>
  )
}