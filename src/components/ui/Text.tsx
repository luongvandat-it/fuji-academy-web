"use client";

import { cn } from "@/lib";
import { getTextClasses, type TextVariant } from "@/lib/typography";

type TextElement = "span" | "p" | "h1" | "h2" | "h3" | "label" | "div";

export type TextProps = {
  variant: TextVariant;
  as?: TextElement;
  className?: string;
  children?: React.ReactNode;
  htmlFor?: string;
} & React.HTMLAttributes<HTMLElement>;

const defaultElement: Record<TextVariant, TextElement> = {
  "HEADING.ONE": "h1",
  "HEADING.TWO": "h2",
  "HEADING.THREE": "h3",
  "BODY.LARGE": "p",
  "BODY.MEDIUM": "p",
  "BODY.SMALL": "p",
  "BUTTON_LABEL.EXTRA_LARGE": "span",
  "BUTTON_LABEL.LARGE": "span",
  "BUTTON_LABEL.MEDIUM": "span",
  "BUTTON_LABEL.SMALL": "span",
  "LABEL.LARGE": "span",
  "LABEL.MEDIUM": "span",
  "LABEL.SMALL": "span",
  CAPTION: "span",
};

export function Text({
  variant,
  as,
  className,
  children,
  ...props
}: TextProps) {
  const Component = as ?? defaultElement[variant];
  return (
    <Component
      className={cn(getTextClasses(variant), className)}
      {...props}
    >
      {children}
    </Component>
  );
}
