"use client";

import { Text } from "@/components/ui";
import { BarChartIcon } from "@/icon";
import styles from "../report.module.scss";

interface SummaryCardsProps {
  courseCompletionPercent: number;
  courseCompletionChange: number;
  averageScore: number;
  averageScoreMax: number;
}

export function SummaryCards({
  courseCompletionPercent,
  courseCompletionChange,
  averageScore,
  averageScoreMax,
}: SummaryCardsProps) {
  const scoreBlocks = 5;
  const filledCount = Math.round((averageScore / averageScoreMax) * scoreBlocks);

  return (
    <div className={styles.summaryRow}>
      <section className={styles.summaryCard} aria-labelledby="completion-label">
        <BarChartIcon className={styles.summaryCardIcon} aria-hidden />
        <Text variant="LABEL.MEDIUM" as="p" id="completion-label" className={styles.summaryLabel}>
          Hoàn thành khóa học
        </Text>
        <Text variant="BODY.LARGE" as="p" className={styles.summaryValue}>
          {courseCompletionPercent}%
        </Text>
        <Text variant="BODY.SMALL" as="p" className={styles.summaryChange}>
          +{courseCompletionChange}%
        </Text>
        <div className={styles.progressBarWrap}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${courseCompletionPercent}%` }}
          />
        </div>
      </section>

      <section className={styles.summaryCard} aria-labelledby="score-label">
        <BarChartIcon className={styles.summaryCardIcon} aria-hidden />
        <Text variant="LABEL.MEDIUM" as="p" id="score-label" className={styles.summaryLabel}>
          Điểm trung bình
        </Text>
        <Text variant="BODY.LARGE" as="p" className={styles.summaryValue}>
          {averageScore.toFixed(1)} / {averageScoreMax}
        </Text>
        <div className={styles.scoreBlocks}>
          {Array.from({ length: scoreBlocks }).map((_, i) => (
            <div
              key={i}
              className={`${styles.scoreBlock} ${
                i < filledCount
                  ? i === filledCount - 1 && filledCount < scoreBlocks
                    ? styles.scoreBlockFilledStrong
                    : styles.scoreBlockFilled
                  : ""
              }`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
