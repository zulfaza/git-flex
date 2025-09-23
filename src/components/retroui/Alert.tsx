import { HtmlHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Text } from "@/components/retroui/Text";

const alertVariants = cva("relative w-full border-2 border-border p-4 shadow-md", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      solid: "bg-secondary text-secondary-foreground",
    },
    status: {
      error: "bg-destructive text-destructive-foreground border-destructive",
      success: "bg-green-300 text-green-800 border-green-800",
      warning: "bg-yellow-300 text-yellow-800 border-yellow-800",
      info: "bg-blue-300 text-blue-800 border-blue-800",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface IAlertProps
  extends HtmlHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = ({ className, variant, status, ...props }: IAlertProps) => (
  <div
    role="alert"
    className={cn(alertVariants({ variant, status }), className)}
    {...props}
  />
);
Alert.displayName = "Alert";

const AlertTitle = ({ className, ...props }: HtmlHTMLAttributes<HTMLHeadingElement>) => (
  <Text as="h5" className={cn(className)} {...props} />
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = ({ className, ...props }: HtmlHTMLAttributes<HTMLParagraphElement>) => (
  <div className={cn("text-muted-foreground", className)} {...props} />
);

AlertDescription.displayName = "AlertDescription";

const AlertComponent = Object.assign(Alert, {
  Title: AlertTitle,
  Description: AlertDescription,
});

export { AlertComponent as Alert };
