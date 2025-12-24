import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, Check } from "lucide-react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[8px] text-sm font-medium transition-all duration-[var(--transition-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] min-h-[44px]",
  {
    variants: {
      variant: {
        primary:
          "bg-[#3B82F6] text-white shadow-md hover:bg-gradient-to-br hover:from-[#3B82F6] hover:to-[#2563EB] hover:shadow-[0_4px_12px_rgba(59,130,246,0.4)] transition-all",
        secondary:
          "border border-slate-300 dark:border-slate-700 bg-white/5 dark:bg-white/5 text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-sm",
        tertiary:
          "bg-transparent text-foreground/70 hover:text-primary hover:underline min-h-0 h-auto p-0",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-sm",
        outline:
          "border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-accent-foreground hover:shadow-sm",
        ghost: "hover:bg-slate-100 dark:hover:bg-slate-800",
        link: "text-primary underline-offset-4 hover:underline",
        success:
          "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md",
      },
      size: {
        default: "px-6 py-3 md:px-[24px] md:py-[12px] px-[28px] py-[14px]",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        md: "px-6 py-3 md:px-[24px] md:py-[12px] px-[28px] py-[14px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      success,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const content = () => {
      if (loading) {
        return (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Chargement...
          </>
        );
      }
      if (success) {
        return (
          <>
            <Check className="mr-2 h-4 w-4" />
            Enregistré
          </>
        );
      }
      return (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      );
    };

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant: success ? "success" : variant,
            size,
            className,
          })
        )}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {content()}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
