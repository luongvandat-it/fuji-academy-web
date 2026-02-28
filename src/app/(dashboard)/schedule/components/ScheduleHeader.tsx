"use client";

import { Button } from "@/components/ui";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "@/icon";
import { memo } from "react";
import styles from "../schedule.module.scss";

export type ScheduleViewMode = "week" | "month";

interface ScheduleHeaderProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  viewMode?: ScheduleViewMode;
  onViewModeChange?: (mode: ScheduleViewMode) => void;
  showMonthCalendar?: boolean;
  onToggleMonthCalendar?: () => void;
}

export const ScheduleHeader = memo(function ScheduleHeader({
  label,
  onPrev,
  onNext,
  onToday,
  viewMode,
  onViewModeChange,
  showMonthCalendar,
  onToggleMonthCalendar,
}: ScheduleHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <Button variant="secondary" onClick={onToday} className={styles.todayBtn}>
          Hôm nay
        </Button>
        <div className={styles.weekNav}>
          <Button variant="secondary" onClick={onPrev} className={styles.monthNavBtn} aria-label={viewMode === "month" ? "Tháng trước" : "Tuần trước"}>
            <ChevronLeftIcon />
            <span className={styles.monthNavBtnText}>{viewMode === "month" ? "Tháng trước" : "Tuần trước"}</span>
          </Button>
          <span className={styles.monthNavLabel}>{label}</span>
          <Button variant="secondary" onClick={onNext} className={styles.monthNavBtn} aria-label={viewMode === "month" ? "Tháng sau" : "Tuần sau"}>
            <span className={styles.monthNavBtnText}>{viewMode === "month" ? "Tháng sau" : "Tuần sau"}</span>
            <ChevronRightIcon />
          </Button>
        </div>
        {onToggleMonthCalendar && (
          <Button
            variant="secondary"
            onClick={onToggleMonthCalendar}
            className={`${styles.calendarToggleBtn} ${showMonthCalendar ? styles.calendarToggleBtnActive : ""}`}
            aria-label={showMonthCalendar ? "Ẩn lịch tháng" : "Hiển thị lịch tháng"}
          >
            <CalendarIcon />
          </Button>
        )}
      </div>
      {viewMode !== undefined && onViewModeChange && (
        <div className={styles.headerRight}>
          <div className={styles.viewToggle}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onViewModeChange("week")}
              className={viewMode === "week" ? `${styles.viewToggleSegment} ${styles.viewToggleSegmentActive}` : styles.viewToggleSegment}
            >
              Tuần
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onViewModeChange("month")}
              className={viewMode === "month" ? `${styles.viewToggleSegment} ${styles.viewToggleSegmentActive}` : styles.viewToggleSegment}
            >
              Tháng
            </Button>
          </div>
        </div>
      )}
    </header>
  );
});

ScheduleHeader.displayName = "ScheduleHeader";
