import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder = "Enter text",
  className = "",
  ...props
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`px-4 py-2 w-full border-2 border-border bg-input text-foreground shadow-md transition focus:outline-hidden focus:shadow-xs focus:border-primary placeholder:text-muted-foreground font-sans ${
        props["aria-invalid"]
          ? "border-destructive text-destructive shadow-xs"
          : ""
      } ${className}`}
      {...props}
    />
  );
};
