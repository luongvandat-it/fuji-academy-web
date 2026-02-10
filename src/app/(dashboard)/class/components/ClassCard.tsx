"use client";

import type { ClassData } from "@/service/modules/class/logic";
import styles from "../class.module.scss";

function formatDate(ymd: string): string {
  const d = new Date(ymd + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface ClassCardProps {
  item: ClassData;
  hasClassToday?: boolean;
}

export function ClassCard({ item, hasClassToday = false }: ClassCardProps) {
  const type = (item.class_type || "offline").toLowerCase();
  const isOnline = type === "online";

  return (
    <article className={`${styles.card} ${hasClassToday ? styles.cardToday : ""}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderTitle}>
          <h2 className={styles.className}>{item.class_name}</h2>
          {hasClassToday && (
            <span className={styles.badgeToday} title="Has class today">
              Today
            </span>
          )}
        </div>
        <span
          className={`${styles.badge} ${isOnline ? styles.badgeOnline : styles.badgeOffline}`}
        >
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Subject</span>
          <span className={styles.rowValue}>{item.subject_name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Teacher</span>
          <span className={styles.rowValue}>{item.teacher_name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Room</span>
          <span className={styles.rowValue}>{item.classroom_name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Period</span>
          <span className={styles.dates}>
            {formatDate(item.start_date)} – {formatDate(item.end_date)}
          </span>
        </div>
      </div>
      <div className={styles.studentCount}>
        {item.student_count} student{item.student_count !== 1 ? "s" : ""}
      </div>
    </article>
  );
}
