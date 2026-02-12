"use client";

import { forwardRef } from "react";
import { cn } from "@/lib";
import { Text } from "./Text";
import styles from "./Input.module.scss";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  inputClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      inputClassName,
      label,
      error,
      id: idProp,
      ...props
    },
    ref
  ) => {
    const id = idProp ?? props.name ?? `input-${Math.random().toString(36).slice(2)}`;

    return (
      <div className={cn(styles.root, className)}>
        {label && (
          <Text
            variant="LABEL.MEDIUM"
            as="label"
            htmlFor={id}
            className={styles.label}
          >
            {label}
          </Text>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            styles.input,
            error && styles.inputError,
            inputClassName
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {error && (
          <Text
            variant="BODY.SMALL"
            as="p"
            id={`${id}-error`}
            className={styles.errorText}
            role="alert"
          >
            {error}
          </Text>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
