"use client";

import { memo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icon";
import { formatWeekRange } from "@/app/(dashboard)/schedule/utils";
import styles from "../schedule.module.scss";

interface ScheduleHeaderProps {
  weekStart: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export const ScheduleHeader = memo(function ScheduleHeader({
  weekStart,
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
          <button type="button" onClick={onPrev} className={styles.monthNavBtn} aria-label="Tuần trước">
            <ChevronLeftIcon />
          </button>
          <span className={styles.monthNavLabel}>{formatWeekRange(weekStart)}</span>
          <button type="button" onClick={onNext} className={styles.monthNavBtn} aria-label="Tuần sau">
            <ChevronRightIcon />
          </button>
        </div>
      </div>
      <div className={styles.headerRight}>
        <button type="button" className={styles.newBtn}>
          Mới
        </button>
      </div>
    </header>
  );
});
