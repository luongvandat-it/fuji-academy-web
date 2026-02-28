"use client";

import { Button } from "@/components/ui";
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
        <Button
          key={key}
          type="button"
          variant="secondary"
          onClick={() => onViewModeChange(key)}
          className={viewMode === key ? `${styles.tab} ${styles.tabActive}` : styles.tab}
        >
          {label}
        </Button>
      ))}
    </div>
  );
});

ScheduleTabs.displayName = "ScheduleTabs";
