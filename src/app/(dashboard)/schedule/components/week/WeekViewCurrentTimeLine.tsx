"use client";

import { memo } from "react";
import styles from "../../schedule.module.scss";

interface WeekViewCurrentTimeLineProps {
  topPx: number;
}

export const WeekViewCurrentTimeLine = memo(function WeekViewCurrentTimeLine({
  topPx,
}: WeekViewCurrentTimeLineProps) {
  return (
    <div
      className={styles.currentTimeLine}
      style={{ top: topPx }}
      aria-hidden
    >
      <span className={styles.currentTimeDot} />
      <span className={styles.currentTimeRule} />
    </div>
  );
});

WeekViewCurrentTimeLine.displayName = "WeekViewCurrentTimeLine";
