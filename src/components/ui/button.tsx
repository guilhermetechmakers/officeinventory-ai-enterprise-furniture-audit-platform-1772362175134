import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-card hover:bg-primary/90 hover:shadow-elevated hover:scale-[1.02] active:scale-[0.98]',
        destructive:
          'bg-destructive text-white shadow-card hover:bg-destructive/90 hover:shadow-elevated hover:scale-[1.02] active:scale-[0.98]',
        outline:
          'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] active:scale-[0.98]',
        secondary:
          'bg-secondary text-secondary-foreground border border-border shadow-card hover:shadow-elevated hover:scale-[1.02] active:scale-[0.98]',
        ghost: 'hover:bg-muted/50 hover:scale-[1.02] active:scale-[0.98]',
        link: 'text-primary underline-offset-4 hover:underline',
        dark: 'bg-[rgb(var(--primary-foreground))] text-primary hover:bg-[rgb(var(--primary-foreground))]/90 hover:shadow-elevated hover:scale-[1.02] active:scale-[0.98]',
      },
      size: {
        default: 'h-11 px-6 py-2 text-sm',
        sm: 'h-9 rounded-full px-4 text-xs',
        lg: 'h-12 rounded-full px-8 text-base',
        xl: 'h-14 rounded-full px-10 text-lg',
        icon: 'h-11 w-11',
        'icon-sm': 'h-9 w-9',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
