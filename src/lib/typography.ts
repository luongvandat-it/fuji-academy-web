export const TEXT_VARIANTS = {
  "HEADING.ONE":
    "text-3xl font-bold tracking-tight text-gray-900 md:text-4xl",
  "HEADING.TWO": "text-2xl font-bold text-gray-900",
  "HEADING.THREE": "text-xl font-semibold text-gray-900",

  "BODY.LARGE": "text-lg text-gray-700 leading-relaxed",
  "BODY.MEDIUM": "text-base text-gray-700 leading-normal",
  "BODY.SMALL": "text-sm text-gray-600 leading-normal",

  "BUTTON_LABEL.EXTRA_LARGE": "text-lg font-semibold",
  "BUTTON_LABEL.LARGE": "text-base font-semibold",
  "BUTTON_LABEL.MEDIUM": "text-sm font-medium",
  "BUTTON_LABEL.SMALL": "text-xs font-medium",

  "LABEL.LARGE": "text-base font-medium text-gray-900",
  "LABEL.MEDIUM": "text-sm font-medium text-gray-700",
  "LABEL.SMALL": "text-xs font-medium text-gray-600",

  CAPTION: "text-xs text-gray-500 uppercase tracking-wide",
} as const;

export type TextVariant = keyof typeof TEXT_VARIANTS;

export function getTextClasses(variant: TextVariant): string {
  return TEXT_VARIANTS[variant];
}
