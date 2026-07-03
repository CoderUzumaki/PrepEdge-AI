import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

/**
 * Label — accessible form field label.
 */
export function Label({ className, ...props }) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "text-sm font-medium leading-none text-[var(--color-foreground)] peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
}
