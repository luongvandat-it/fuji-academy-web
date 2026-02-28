"use client";

import { Text } from "@/components/ui";
import type { BarChartItem } from "../types";
import styles from "../report.module.scss";

interface BarChartCardProps {
  title: string;
  items: BarChartItem[];
}

function formatValue(item: BarChartItem): string {
  const max = item.max ?? 100;
  if (max === 10) return `${item.value.toFixed(1)}`;
  return `${Math.round(item.value)}%`;
}

function toId(title: string): string {
  return `chart-${title.replace(/[\s/]+/g, "-").replace(/^-|-$/g, "")}`;
}

export function BarChartCard({ title, items }: BarChartCardProps) {
  const id = toId(title);
  return (
    <section className={styles.chartCard} aria-labelledby={id}>
      <Text variant="HEADING.THREE" as="h3" id={id} className={styles.chartCardTitle}>
        {title}
      </Text>
      <ul className={styles.barChartList}>
        {items.map((item, i) => {
          const max = item.max ?? 100;
          const pct = Math.min(100, Math.max(0, (item.value / max) * 100));
          return (
            <li key={i} className={styles.barChartRow}>
              <Text variant="BODY.SMALL" as="span" className={styles.barChartLabel}>
                {item.label}
              </Text>
              <div className={styles.barChartBarWrap}>
                <div className={styles.barChartBar}>
                  <div
                    className={styles.barChartBarFill}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <Text variant="BODY.SMALL" as="span" className={styles.barChartValue}>
                  {formatValue(item)}
                </Text>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
