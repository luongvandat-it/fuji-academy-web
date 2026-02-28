"use client";

import { Button, Text } from "@/components/ui";
import type { CourseProgressItem } from "../types";
import styles from "../report.module.scss";

interface CourseProgressTableProps {
  items: CourseProgressItem[];
  onDownload?: () => void;
}

export function CourseProgressTable({
  items,
  onDownload,
}: CourseProgressTableProps) {
  return (
    <section className={styles.section} aria-labelledby="progress-section-title">
      <div className={styles.sectionHead}>
        <Text variant="HEADING.TWO" as="h2" id="progress-section-title" className={styles.sectionTitle}>
          Chi tiết tiến độ khóa học
        </Text>
        <Button
          type="button"
          variant="secondary"
          className={styles.downloadBtn}
          onClick={onDownload}
        >
          Tải báo cáo
        </Button>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Khóa học</th>
              <th scope="col">Tiến độ</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id}>
                <td>
                  <div className={styles.tableCourse}>
                    <Text variant="CAPTION" as="span" className={styles.tableCourseIcon}>
                      📚
                    </Text>
                    <Text variant="BODY.MEDIUM" as="span">
                      {row.courseName}
                    </Text>
                  </div>
                </td>
                <td>
                  <div className={styles.tableProgressWrap}>
                    <div className={styles.tableProgressBar}>
                      <div
                        className={`${styles.tableProgressFill} ${
                          row.progress === 100 ? styles.tableProgressComplete : ""
                        }`}
                        style={{ width: `${row.progress}%` }}
                      />
                    </div>
                    <Text variant="BODY.SMALL" as="span" className={styles.tableProgressPercent}>
                      {row.progress}%
                    </Text>
                  </div>
                </td>
                <td>
                  <Text
                    variant="BUTTON_LABEL.SMALL"
                    as="span"
                    className={`${styles.badge} ${
                      row.status === "completed"
                        ? styles.badgeComplete
                        : styles.badgeProgress
                    }`}
                  >
                    {row.status === "completed" ? "HOÀN THÀNH" : "ĐANG HỌC"}
                  </Text>
                </td>
                <td>
                  <Text variant="BODY.SMALL" as="span">
                    {row.lastUpdated}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
