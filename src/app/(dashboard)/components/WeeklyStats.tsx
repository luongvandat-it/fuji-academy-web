"use client";

import { Text } from "@/components/ui";
import styles from "../home.module.scss";

interface WeeklyStatsProps {
  homeworkCount: number;
  unsubmittedCount: number;
}

export function WeeklyStats({
  homeworkCount,
  unsubmittedCount,
}: WeeklyStatsProps) {
  return (
    <div className={styles.weeklyStatsCard}>
      <Text variant="HEADING.TWO" as="h2" className={styles.weeklyStatsTitle}>
        Thống kê học tập tuần này
      </Text>
      <div className={styles.weeklyStatsGrid}>
        <div className={styles.statCard}>
          <Text variant="LABEL.SMALL" as="span" className={styles.statLabel}>
            BÀI TẬP
          </Text>
          <Text variant="HEADING.ONE" as="span" className={styles.statValue}>
            {homeworkCount}
          </Text>
          {unsubmittedCount > 0 && (
            <Text variant="BODY.SMALL" as="span" className={styles.statSubtext}>
              {unsubmittedCount} bài chưa nộp
            </Text>
          )}
        </div>
      </div>
    </div>
  );
}
