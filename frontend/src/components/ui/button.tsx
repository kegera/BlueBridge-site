import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-body font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0",
  {
    variants: {
      variant: {
        default:     "gradient-primary text-white shadow-[0_4px_14px_rgba(30,94,255,.35)] hover:shadow-[0_6px_20px_rgba(30,94,255,.45)]",
        teal:        "gradient-teal text-white shadow-[0_4px_14px_rgba(17,181,164,.3)]",
        warm:        "gradient-warm text-navy font-bold shadow-[0_4px_14px_rgba(255,176,32,.3)]",
        outline:     "bg-surface text-navy border border-bborder shadow-sm hover:border-primary hover:bg-accent",
        ghost:       "bg-white/10 text-white border border-white/20 hover:bg-white/20",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link:        "text-primary underline-offset-4 hover:underline hover:-translate-y-0",
      },
      size: {
        sm:      "px-4 py-2 text-sm rounded-sm",
        default: "px-6 py-[11px] text-sm rounded",
        lg:      "px-7 py-3.5 text-base rounded-lg",
        icon:    "h-10 w-10 rounded-sm",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
