"use client";

import { memo } from "react";
import { BarChartIcon, BellIcon, CalendarIcon } from "@/icon";
import styles from "../schedule.module.scss";

export const ScheduleCards = memo(function ScheduleCards() {
  return (
    <div className={styles.cards}>
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <CalendarIcon className={styles.cardTitleIcon} />
          Next Class
        </div>
        <div className={styles.cardContent}>
          <div className={styles.cardContentHighlight}>Today, 1:00 PM</div>
          <div>Pronunciation Workshop</div>
          <div className={styles.cardContentMuted}>Room 105 • Starts in 45 mins</div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <BarChartIcon className={styles.cardTitleIcon} />
          Weekly Stats
        </div>
        <div className={styles.barChart}>
          {[4, 7, 5, 8, 6, 9, 5].map((h, i) => (
            <div key={i} className={styles.bar} style={{ height: `${Math.max(8, h * 8)}%` }} title={`${h}h`} />
          ))}
        </div>
        <div className={styles.cardContent}>18.5 total study hours this week</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <BellIcon className={styles.cardTitleIcon} />
          Reminders
        </div>
        <ul className={styles.reminderList}>
          <li>Submit Essay Draft (Thu 5PM)</li>
          <li>Prepare for Mock Test (Fri)</li>
        </ul>
      </div>
    </div>
  );
});
