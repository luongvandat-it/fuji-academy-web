"use client";

import { memo } from "react";
import type { ViewMode } from "@/app/(dashboard)/schedule/types";
import styles from "../schedule.module.scss";

interface ScheduleTabsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const MODES: { key: ViewMode; label: string }[] = [
  { key: "day", label: "Hôm nay" },
  { key: "week", label: "Tuần" },
  { key: "month", label: "Tháng" },
];

export const ScheduleTabs = memo(function ScheduleTabs({ viewMode, onViewModeChange }: ScheduleTabsProps) {
  return (
    <div className={styles.tabs}>
      {MODES.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onViewModeChange(key)}
          className={viewMode === key ? `${styles.tab} ${styles.tabActive}` : styles.tab}
        >
          {label}
        </button>
      ))}
    </div>
  );
});
