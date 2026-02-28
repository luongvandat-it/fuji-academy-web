"use client";

import { Text } from "@/components/ui";
import { memo } from "react";
import styles from "../../schedule.module.scss";

interface WeekGridDayHeaderProps {
  dayName: string;
  dayNum: number;
  isToday: boolean;
  hasEvents?: boolean; 
}

export const WeekGridDayHeader = memo(function WeekGridDayHeader({
  dayName,
  dayNum,
  isToday,
  hasEvents = false,
}: WeekGridDayHeaderProps) {
  return (
    <th
      className={`${styles.weekDayHeader} ${isToday ? styles.weekDayHeaderToday : ""} ${hasEvents ? styles.weekDayHeaderHasEvents : ""}`}
      scope="col"
    >
      <Text variant="BODY.SMALL" as="span" className={styles.weekDayName}>
        {dayName}
      </Text>
      <Text variant="CAPTION" as="span" className={styles.weekDayNumWrap}>
        <Text variant="BODY.LARGE" as="span" className={styles.weekDayNum}>
          {dayNum}
        </Text>
        <Text variant="CAPTION" as="span" className={styles.weekDayDots}>
          {isToday && <Text variant="CAPTION" as="span" className={styles.weekDayNumDot} aria-hidden title="Hôm nay" />}
          {hasEvents && <Text variant="CAPTION" as="span" className={styles.weekDayEventDot} aria-hidden title="Có lịch học" />}
        </Text>
      </Text>
    </th>
  );
});

WeekGridDayHeader.displayName = "WeekGridDayHeader";