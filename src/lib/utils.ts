/**
 * Các hàm tiện ích dùng chung
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[];

/**
 * Gộp class names (tương tự clsx / tailwind-merge)
 */
export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat()
    .filter((x) => typeof x === "string" && x.length > 0)
    .join(" ")
    .trim();
}
