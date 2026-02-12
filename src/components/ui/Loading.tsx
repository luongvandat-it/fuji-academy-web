"use client";

import { cn } from "@/lib";
import styles from "./Loading.module.scss";

interface LoadingProps {
  className?: string;
}

export function Loading({ className }: LoadingProps) {
  return (
    <div
      className={cn(styles.spinner, className)}
      role="status"
      aria-label="Đang tải"
    />
  );
}
