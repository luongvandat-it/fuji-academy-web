"use client";

import { memo } from "react";
import styles from "../../schedule.module.scss";

interface WeekGridDayHeaderProps {
  dayName: string;
  dayNum: number;
  isToday: boolean;
}

export const WeekGridDayHeader = memo(function WeekGridDayHeader({
  dayName,
  dayNum,
  isToday,
}: WeekGridDayHeaderProps) {
  return (
    <th
      className={`${styles.weekDayHeader} ${isToday ? styles.weekDayHeaderToday : ""}`}
      scope="col"
    >
      <span className={styles.weekDayName}>{dayName}</span>
      <span className={styles.weekDayNumWrap}>
        <span className={styles.weekDayNum}>{dayNum}</span>
        {isToday && <span className={styles.weekDayNumDot} aria-hidden />}
      </span>
    </th>
  );
});
