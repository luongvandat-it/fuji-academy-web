"use client";

interface LoadingProps {
  className?: string;
}

export function Loading({ className }: LoadingProps) {
  return (
    <div
      className={`inline-block size-8 animate-spin rounded-full border-2 border-gray-200 border-t-primary-500 ${className ?? ""}`}
      role="status"
      aria-label="Đang tải"
    />
  );
}
