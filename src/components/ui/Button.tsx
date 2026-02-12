"use client";

import { cn } from "@/lib";
import styles from "./Button.module.scss";

export type ButtonVariant = "primary" | "secondary" | "link";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  className,
  variant = "primary",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(styles.button, styles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
