"use client";

import { Button } from "@/components/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icon";
import { memo } from "react";
import styles from "../schedule.module.scss";

export type ScheduleViewMode = "month" | "week";

interface ScheduleHeaderProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  viewMode?: ScheduleViewMode;
  onViewModeChange?: (mode: ScheduleViewMode) => void;
}

const NAV_LABELS = {
  month: { prev: "Tháng trước", next: "Tháng sau" },
  week: { prev: "Tuần trước", next: "Tuần sau" },
} as const;

export const ScheduleHeader = memo(function ScheduleHeader({
  label,
  onPrev,
  onNext,
  onToday,
  viewMode = "month",
  onViewModeChange,
}: ScheduleHeaderProps) {
  const nav = NAV_LABELS[viewMode];
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <Button variant="secondary" onClick={onToday} className={styles.todayBtn}>
          Hôm nay
        </Button>
        <div className={styles.weekNav}>
          <Button variant="secondary" onClick={onPrev} className={styles.monthNavBtn} aria-label={nav.prev}>
            <ChevronLeftIcon />
            <span className={styles.monthNavBtnText}>{nav.prev}</span>
          </Button>
          <span className={styles.monthNavLabel}>{label}</span>
          <Button variant="secondary" onClick={onNext} className={styles.monthNavBtn} aria-label={nav.next}>
            <span className={styles.monthNavBtnText}>{nav.next}</span>
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
      <div className={styles.headerRight}>
        {onViewModeChange && (
          <div className={styles.viewToggle} role="tablist" aria-label="Chế độ xem">
            <Button
              type="button"
              role="tab"
              aria-selected={viewMode === "month"}
              variant="secondary"
              className={`${styles.viewToggleSegment} ${viewMode === "month" ? styles.viewToggleSegmentActive : ""}`}
              onClick={() => onViewModeChange("month")}
            >
              Tháng
            </Button>
            <Button
              type="button"
              role="tab"
              aria-selected={viewMode === "week"}
              variant="secondary"
              className={`${styles.viewToggleSegment} ${viewMode === "week" ? styles.viewToggleSegmentActive : ""}`}
              onClick={() => onViewModeChange("week")}
            >
              Tuần
            </Button>
          </div>
        )}
      </div>
    </header>
  );
});
