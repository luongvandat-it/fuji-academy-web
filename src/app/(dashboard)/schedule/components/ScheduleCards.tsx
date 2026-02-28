"use client";

import { Text } from "@/components/ui";
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
          <Text variant="LABEL.MEDIUM" as="span">
            Lớp sắp tới
          </Text>
        </div>
        <div className={styles.cardContent}>
          <Text variant="BODY.MEDIUM" as="div" className={styles.cardContentHighlight}>
            Hôm nay, 13:00
          </Text>
          <Text variant="BODY.MEDIUM" as="div">
            Workshop phát âm
          </Text>
          <Text variant="BODY.SMALL" as="div" className={styles.cardContentMuted}>
            Phòng 105 • Bắt đầu sau 45 phút
          </Text>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <BarChartIcon className={styles.cardTitleIcon} />
          <Text variant="LABEL.MEDIUM" as="span">
            Thống kê tuần
          </Text>
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
        <Text variant="BODY.MEDIUM" as="div" className={styles.cardContent}>
          18,5 giờ học trong tuần này
        </Text>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <BellIcon className={styles.cardTitleIcon} />
          <Text variant="LABEL.MEDIUM" as="span">
            Nhắc nhở
          </Text>
        </div>
        <ul className={styles.reminderList}>
          <li>
            <Text variant="BODY.SMALL" as="span">
              Nộp bản nháp bài luận (Thứ 5, 17h)
            </Text>
          </li>
          <li>
            <Text variant="BODY.SMALL" as="span">
              Chuẩn bị thi thử (Thứ 6)
            </Text>
          </li>
        </ul>
      </div>
    </div>
  );
});

ScheduleCards.displayName = "ScheduleCards";
