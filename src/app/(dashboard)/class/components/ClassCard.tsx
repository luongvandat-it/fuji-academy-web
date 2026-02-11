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
            <span className={styles.badgeToday} title="Có lịch hôm nay">
              Hôm nay
            </span>
          )}
        </div>
        <span
          className={`${styles.badge} ${isOnline ? styles.badgeOnline : styles.badgeOffline}`}
        >
          {isOnline ? "Trực tuyến" : "Trực tiếp"}
        </span>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Môn học</span>
          <span className={styles.rowValue}>{item.subject_name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Giáo viên</span>
          <span className={styles.rowValue}>{item.teacher_name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Phòng</span>
          <span className={styles.rowValue}>{item.classroom_name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Kỳ học</span>
          <span className={styles.dates}>
            {formatDate(item.start_date)} – {formatDate(item.end_date)}
          </span>
        </div>
      </div>
      <div className={styles.studentCount}>
        {item.student_count} học viên
      </div>
    </article>
  );
}
