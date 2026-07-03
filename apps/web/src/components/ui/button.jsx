import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90",
        cta:
          "bg-[var(--color-cta)] text-[var(--color-cta-foreground)] hover:opacity-90",
        secondary:
          "bg-[var(--color-secondary)] text-[var(--color-foreground)] hover:opacity-80",
        outline:
          "border border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-surface)]",
        ghost: "hover:bg-[var(--color-surface)]",
        destructive:
          "bg-[var(--color-destructive)] text-white hover:opacity-90",
        link: "text-[var(--color-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

/**
 * Button — primary interactive control with consistent sizing and focus ring.
 * @param {Object} props
 * @param {boolean} [props.asChild]
 */
export function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
