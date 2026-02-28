"use client";

import { Button, Text } from "@/components/ui";
import type { RecentActivityItem } from "../types";
import styles from "../report.module.scss";

interface RecentActivityProps {
  items: RecentActivityItem[];
}

const ICON_MAP = {
  watch: styles.activityIconWatch,
  complete: styles.activityIconComplete,
  upload: styles.activityIconUpload,
  save: styles.activityIconSave,
} as const;

function ActivityIcon({ type }: { type: RecentActivityItem["type"] }) {
  return (
    <Text
      variant="CAPTION"
      as="span"
      className={`${styles.activityIconWrap} ${ICON_MAP[type]}`}
      aria-hidden
    >
      {type === "watch" && "▶"}
      {type === "complete" && "✓"}
      {type === "upload" && "↑"}
      {type === "save" && "●"}
    </Text>
  );
}

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <section className={styles.activityCard} aria-labelledby="activity-title">
      <Text variant="HEADING.THREE" as="h3" id="activity-title" className={styles.activityCardTitle}>
        Hoạt động gần đây
      </Text>
      <ul className={styles.activityList}>
        {items.map((item) => (
          <li key={item.id} className={styles.activityItem}>
            <ActivityIcon type={item.type} />
            <div className={styles.activityBody}>
              <Text variant="BODY.MEDIUM" as="p" className={styles.activityTitle}>
                {item.title}
              </Text>
              <Text variant="BODY.SMALL" as="p" className={styles.activityMeta}>
                {item.timeAgo}
                {item.score != null && ` • ${item.score}`}
              </Text>
            </div>
          </li>
        ))}
      </ul>
      <Button type="button" variant="secondary" className={styles.viewAllBtn}>
        Xem tất cả
      </Button>
    </section>
  );
}
