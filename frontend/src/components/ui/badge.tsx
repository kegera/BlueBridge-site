import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:     "bg-primary/10 text-primary border border-primary/25",
        teal:        "bg-teal/10 text-teal border border-teal/25",
        warm:        "bg-warm/15 text-amber-700 border border-warm/30",
        navy:        "bg-navy text-white",
        outline:     "bg-white/80 border border-bborder text-navy backdrop-blur-sm",
        destructive: "bg-destructive/10 text-destructive border border-destructive/25",
        success:     "bg-teal/10 text-teal border border-teal/25",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
