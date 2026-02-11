"use client";

import { forwardRef } from "react";
import { cn } from "@/lib";
import { Text } from "./Text";

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
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <Text
            variant="LABEL.MEDIUM"
            as="label"
            htmlFor={id}
            className="text-gray-900 dark:text-gray-100"
          >
            {label}
          </Text>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900",
            "placeholder:text-gray-400",
            "focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
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
            className="text-red-600 dark:text-red-400"
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
