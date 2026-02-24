"use client";

import { CheckMarkIcon, DocumentIcon } from "@/icon";
import type { Assignment } from "../types";
import styles from "../homework.module.scss";

function formatSubmittedAt(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString("vi-VN");
  const time = d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `Đã nộp lúc ${time}, ${date}`;
}

function formatSubmittedDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN");
}

interface AssignmentCardProps {
  assignment: Assignment;
  onSubmit?: (id: string) => void;
  onDoAssignment?: (id: string) => void;
  onViewSubmission?: (id: string) => void;
}

export function AssignmentCard({
  assignment,
  onSubmit,
  onDoAssignment,
  onViewSubmission,
}: AssignmentCardProps) {
  const { id, category, title, description, status } = assignment;

  const iconWrapClass =
    status === "graded"
      ? styles.cardIconWrapGraded
      : status === "submitted"
        ? styles.cardIconWrapSubmitted
        : styles.cardIconWrapPending;

  return (
    <article className={styles.card}>
      <div className={styles.cardLeft}>
        <div className={`${styles.cardIconWrap} ${iconWrapClass}`}>
          {status === "graded" ? (
            <CheckMarkIcon aria-hidden />
          ) : (
            <DocumentIcon aria-hidden />
          )}
        </div>
        <div className={styles.cardBody}>
          <p className={styles.cardCategory}>{category}</p>
          <h3 className={styles.cardTitle}>{title}</h3>
          {description && (
            <p className={styles.cardDesc}>{description}</p>
          )}
          {status === "graded" &&
            assignment.submittedAt &&
            assignment.feedback && (
              <p className={styles.cardMeta}>
                Đã nộp: {formatSubmittedDate(assignment.submittedAt)} • Phản hồi
                từ giảng viên: {assignment.feedback}
              </p>
            )}
          {status === "submitted" && assignment.submittedAt && (
            <p className={styles.cardMeta}>
              {formatSubmittedAt(assignment.submittedAt)}
            </p>
          )}
        </div>
      </div>
      <div className={styles.cardRight}>
        <div className={styles.cardFooter}>
          {status === "pending_due" && (
            <>
              <span
                className={
                  assignment.dueInDays != null && assignment.dueInDays <= 2
                    ? styles.dueBadge
                    : styles.dueBadgeNormal
                }
              >
                {assignment.dueInDays != null &&
                  `Hết hạn trong ${assignment.dueInDays} ngày`}
              </span>
              {assignment.dueInDays != null && assignment.dueInDays <= 3 ? (
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => onSubmit?.(id)}
                >
                  Nộp bài ngay
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => onDoAssignment?.(id)}
                >
                  Làm bài
                </button>
              )}
            </>
          )}
          {status === "submitted" && (
            <>
              <span className={styles.gradingLabel}>Đang chấm điểm</span>
              <button
                type="button"
                className={styles.actionLink}
                onClick={() => onViewSubmission?.(id)}
              >
                Xem bài đã nộp
              </button>
            </>
          )}
          {status === "graded" && assignment.score != null && (
            <div className={styles.gradedFooter}>
              <span className={styles.scoreLabel}>ĐIỂM SỐ</span>
              <span className={styles.scoreValue}>
                {assignment.score}
                {assignment.maxScore != null ? `/${assignment.maxScore}` : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
