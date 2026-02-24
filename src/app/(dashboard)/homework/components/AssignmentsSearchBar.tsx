"use client";

import { SearchIcon } from "@/icon";
import styles from "../homework.module.scss";

interface AssignmentsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  "aria-label"?: string;
}

export function AssignmentsSearchBar({
  value,
  onChange,
  placeholder = "Tìm kiếm bài tập...",
  "aria-label": ariaLabel = "Tìm kiếm bài tập",
}: AssignmentsSearchBarProps) {
  return (
    <div className={styles.searchWrap}>
      <SearchIcon className={styles.searchWrapIcon} aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.searchInput}
        aria-label={ariaLabel}
      />
    </div>
  );
}
