"use client";

import { memo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icon";
import styles from "../schedule.module.scss";

interface ScheduleHeaderProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export const ScheduleHeader = memo(function ScheduleHeader({
  label,
  onPrev,
  onNext,
  onToday,
}: ScheduleHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button type="button" onClick={onToday} className={styles.todayBtn}>
          Hôm nay
        </button>
        <div className={styles.weekNav}>
          <button type="button" onClick={onPrev} className={styles.monthNavBtn} aria-label="Tháng trước">
            <ChevronLeftIcon />
            <span className={styles.monthNavBtnText}>Tháng trước</span>
          </button>
          <span className={styles.monthNavLabel}>{label}</span>
          <button type="button" onClick={onNext} className={styles.monthNavBtn} aria-label="Tháng sau">
            <span className={styles.monthNavBtnText}>Tháng sau</span>
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </header>
  );
});
