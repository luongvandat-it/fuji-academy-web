"use client";

import { Button, Text } from "@/components";
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
          <Text variant="LABEL.SMALL" as="p" className={styles.cardCategory}>
            {category}
          </Text>
          <div className={styles.cardTitleRow}>
            <Text variant="HEADING.THREE" as="h3" className={styles.cardTitle}>
              {title}
            </Text>
            {status === "pending_due" && (
              <div className={styles.cardTitleActions}>
                {assignment.dueInDays != null && assignment.dueInDays <= 3 ? (
                  <Button
                    type="button"
                    variant="primary"
                    className={styles.actionBtn}
                    onClick={() => onSubmit?.(id)}
                  >
                    <Text variant="BUTTON_LABEL.SMALL" as="span">
                      Nộp bài ngay
                    </Text>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    className={styles.actionBtn}
                    onClick={() => onDoAssignment?.(id)}
                  >
                    <Text variant="BUTTON_LABEL.SMALL" as="span">
                      Làm bài
                    </Text>
                  </Button>
                )}
              </div>
            )}
            {status !== "pending_due" && (
              <div className={styles.cardTitleActions}>
                {status === "submitted" && (
                  <>
                    <Text variant="LABEL.SMALL" as="span" className={styles.gradingLabel}>
                      Đang chấm điểm
                    </Text>
                    <Button
                      type="button"
                      variant="link"
                      className={styles.actionLink}
                      onClick={() => onViewSubmission?.(id)}
                    >
                      <Text variant="LABEL.SMALL" as="span">
                        Xem bài đã nộp
                      </Text>
                    </Button>
                  </>
                )}
                {status === "graded" && assignment.score != null && (
                  <div className={styles.gradedFooter}>
                    <Text variant="CAPTION" as="span" className={styles.scoreLabel}>
                      ĐIỂM SỐ
                    </Text>
                    <Text variant="HEADING.TWO" as="span" className={styles.scoreValue}>
                      {assignment.score}
                      {assignment.maxScore != null ? `/${assignment.maxScore}` : ""}
                    </Text>
                  </div>
                )}
              </div>
            )}
          </div>
          {description && (
            <Text variant="BODY.SMALL" as="p" className={styles.cardDesc}>
              {description}
            </Text>
          )}
          {status === "graded" &&
            assignment.submittedAt &&
            assignment.feedback && (
              <Text variant="BODY.SMALL" as="p" className={styles.cardMeta}>
                Đã nộp: {formatSubmittedDate(assignment.submittedAt)} • Phản hồi
                từ giảng viên: {assignment.feedback}
              </Text>
            )}
          {status === "submitted" && assignment.submittedAt && (
            <Text variant="BODY.SMALL" as="p" className={styles.cardMeta}>
              {formatSubmittedAt(assignment.submittedAt)}
            </Text>
          )}
        </div>
      </div>
      <div className={styles.cardRight}>
        <div className={styles.cardFooter}>
          {status === "pending_due" && (
            <>
              <Text
                variant="LABEL.SMALL"
                as="span"
                className={
                  assignment.dueInDays != null && assignment.dueInDays <= 2
                    ? styles.dueBadge
                    : styles.dueBadgeNormal
                }
              >
                {assignment.dueInDays != null &&
                  `Hết hạn trong ${assignment.dueInDays} ngày`}
              </Text>
              {assignment.dueInDays != null && assignment.dueInDays <= 3 ? (
                <Button
                  type="button"
                  variant="primary"
                  className={styles.actionBtn}
                  onClick={() => onSubmit?.(id)}
                >
                  <Text variant="BUTTON_LABEL.SMALL" as="span">
                    Nộp bài ngay
                  </Text>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  className={styles.actionBtn}
                  onClick={() => onDoAssignment?.(id)}
                >
                  <Text variant="BUTTON_LABEL.SMALL" as="span">
                    Làm bài
                  </Text>
                </Button>
              )}
            </>
          )}
          {status === "submitted" && (
            <>
              <Text variant="LABEL.SMALL" as="span" className={styles.gradingLabel}>
                Đang chấm điểm
              </Text>
              <Button
                type="button"
                variant="link"
                className={styles.actionLink}
                onClick={() => onViewSubmission?.(id)}
              >
                <Text variant="LABEL.SMALL" as="span">
                  Xem bài đã nộp
                </Text>
              </Button>
            </>
          )}
          {status === "graded" && assignment.score != null && (
            <div className={styles.gradedFooter}>
              <Text variant="CAPTION" as="span" className={styles.scoreLabel}>
                ĐIỂM SỐ
              </Text>
              <Text variant="HEADING.TWO" as="span" className={styles.scoreValue}>
                {assignment.score}
                {assignment.maxScore != null ? `/${assignment.maxScore}` : ""}
              </Text>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
