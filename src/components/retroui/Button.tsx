import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React, { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
  "font-head transition-all outline-hidden cursor-pointer duration-200 font-medium flex items-center justify-center",
  {
    variants: {
      variant: {
        default:
          "shadow-md hover:shadow-none bg-primary text-primary-foreground border-2 border-border transition hover:translate-y-1 hover:bg-primary-hover",
        secondary:
          "shadow-md hover:shadow-none bg-secondary text-secondary-foreground border-2 border-border transition hover:translate-y-1",
        outline:
          "shadow-md hover:shadow-none bg-background text-foreground border-2 border-border transition hover:translate-y-1 hover:bg-muted",
        link: "bg-transparent text-foreground hover:underline border-none shadow-none",
      },
      size: {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-8 py-3 text-lg",
        icon: "p-2",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

export interface IButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
  (
    {
      children,
      size = "md",
      className = "",
      variant = "default",
      asChild = false,
      ...props
    }: IButtonProps,
    forwardedRef,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={forwardedRef}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Button.displayName = "Button";
