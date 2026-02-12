"use client";

import { memo } from "react";
import { BarChartIcon, BellIcon, CalendarIcon } from "@/icon";
import styles from "../schedule.module.scss";

const BAR_HOURS = [4, 7, 5, 8, 6, 9, 5] as const;
const BAR_STYLES: ReadonlyArray<{ height: string }> = BAR_HOURS.map((h) => ({
  height: `${Math.max(8, h * 8)}%`,
}));

export const ScheduleCards = memo(function ScheduleCards() {
  return (
    <div className={styles.cards}>
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <CalendarIcon className={styles.cardTitleIcon} />
          Lớp sắp tới
        </div>
        <div className={styles.cardContent}>
          <div className={styles.cardContentHighlight}>Hôm nay, 13:00</div>
          <div>Workshop phát âm</div>
          <div className={styles.cardContentMuted}>Phòng 105 • Bắt đầu sau 45 phút</div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <BarChartIcon className={styles.cardTitleIcon} />
          Thống kê tuần
        </div>
        <div className={styles.barChart}>
          {BAR_HOURS.map((h, i) => (
            <div
              key={i}
              className={styles.bar}
              style={BAR_STYLES[i]}
              title={`${h}h`}
            />
          ))}
        </div>
        <div className={styles.cardContent}>18,5 giờ học trong tuần này</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <BellIcon className={styles.cardTitleIcon} />
          Nhắc nhở
        </div>
        <ul className={styles.reminderList}>
          <li>Nộp bản nháp bài luận (Thứ 5, 17h)</li>
          <li>Chuẩn bị thi thử (Thứ 6)</li>
        </ul>
      </div>
    </div>
  );
});
