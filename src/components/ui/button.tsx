import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium select-none transition-[color,background-color,border-color,transform,opacity] duration-[var(--motion-fast)] ease-[var(--ease-smooth-out)] disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
  {
    variants: {
      variant: {
        primary: "bg-paper text-ink hover:bg-accent",
        secondary:
          "border border-border bg-surface text-fg hover:border-accent/50 hover:text-paper",
        ghost: "text-muted hover:text-fg",
      },
      size: {
        sm: "h-10 min-h-10 px-3 text-sm rounded-sm",
        md: "h-11 min-h-11 px-4 text-sm rounded-md",
        lg: "h-12 min-h-12 px-5 text-base rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
