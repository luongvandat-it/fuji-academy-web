"use client";

import { memo } from "react";
import { BellIcon, ChevronLeftIcon, ChevronRightIcon, SettingsIcon } from "@/icon";
import { formatMonthYear } from "@/app/(dashboard)/schedule/utils";
import styles from "../schedule.module.scss";

interface ScheduleHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
}

export const ScheduleHeader = memo(function ScheduleHeader({
  search,
  onSearchChange,
  currentDate,
  onPrev,
  onNext,
}: ScheduleHeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Weekly Schedule</h1>
      <div className={styles.headerRight}>
        <button type="button" className={`${styles.iconBtn} ${styles.iconBtnRelative}`} aria-label="Notifications">
          <BellIcon />
          <span className={styles.notificationBadge} />
        </button>
        <button type="button" className={styles.iconBtn} aria-label="Settings">
          <SettingsIcon />
        </button>
        <div className={styles.monthNav}>
          <button type="button" onClick={onPrev} className={styles.monthNavBtn} aria-label="Previous">
            <ChevronLeftIcon />
          </button>
          <span className={styles.monthNavLabel}>{formatMonthYear(currentDate)}</span>
          <button type="button" onClick={onNext} className={styles.monthNavBtn} aria-label="Next">
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </header>
  );
});
