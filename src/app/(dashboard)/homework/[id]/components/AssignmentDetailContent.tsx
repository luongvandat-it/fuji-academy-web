"use client";

import { Text } from "@/components/ui";
import { CalendarIcon, ClockIcon, DocumentIcon, PaperclipIcon } from "@/icon";
import type { AssignmentDetail } from "../../types";
import styles from "../assignmentDetail.module.scss";

interface AssignmentDetailContentProps {
  assignment: AssignmentDetail;
  dueDateFormatted: string;
}

export function AssignmentDetailContent({
  assignment,
  dueDateFormatted,
}: AssignmentDetailContentProps) {
  return (
    <>
      <div className={styles.introBlock}>
        <div className={styles.titleRow}>
          <Text variant="HEADING.ONE" as="h1" className={styles.title}>
            {assignment.title}
          </Text>
          {assignment.tag && (
            <Text variant="BUTTON_LABEL.MEDIUM" as="span" className={styles.tag}>
              {assignment.tag}
            </Text>
          )}
        </div>
        <Text variant="BODY.MEDIUM" as="p" className={styles.subtitle}>
          Chuyên mục: <Text variant="BODY.MEDIUM" as="span" className={styles.subtitleStrong}>
            {assignment.categoryLabel}
          </Text>
          {assignment.maxScore != null && (
            <>
              {" • "}
              Điểm tối đa: <Text variant="BODY.MEDIUM" as="span" className={styles.subtitleStrong}>
                {assignment.maxScore}
              </Text>
            </>
          )}
        </Text>
        <div className={styles.deadlineRow}>
          <div className={styles.deadlineCard}>
            <div className={styles.deadlineIcon}>
              <CalendarIcon aria-hidden />
            </div>
            <div className={styles.deadlineContent}>
              <Text variant="LABEL.MEDIUM" as="label">
                Hạn nộp bài
              </Text>
              <Text variant="BODY.MEDIUM" as="span">
                {dueDateFormatted}
              </Text>
            </div>
          </div>
          {assignment.timeRemainingLabel && (
            <div className={styles.deadlineCard}>
              <div className={styles.deadlineIcon}>
                <ClockIcon aria-hidden />
              </div>
              <div className={styles.deadlineContent}>
                <Text variant="LABEL.MEDIUM" as="label">
                  Thời gian còn lại
                </Text>
                <Text variant="BODY.MEDIUM" as="span">
                  {assignment.timeRemainingLabel}
                </Text>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.contentSection}>
      <div className={styles.card}>
        <Text variant="HEADING.TWO" as="h2" className={styles.cardTitle}>
          <Text variant="CAPTION" as="span" className={styles.cardTitleIcon}>
            <DocumentIcon aria-hidden />
          </Text>
          Mô tả chi tiết bài tập
        </Text>
        <div 
          className={styles.descriptionBody}
          dangerouslySetInnerHTML={{ __html: assignment.fullDescription }}
        />
        {assignment.submissionType === "file" && (
          <div className={styles.requirementsBox}>
            <Text variant="LABEL.MEDIUM" as="p" className={styles.requirementsLabel}>
              Yêu cầu nộp file:
            </Text>
            <Text variant="BODY.MEDIUM" as="p">
              {assignment.submissionRequirements}
            </Text>
          </div>
        )}
      </div>

      {assignment.attachments.length > 0 && (
        <div className={styles.card}>
          <Text variant="HEADING.TWO" as="h2" className={styles.cardTitle}>
            <Text variant="CAPTION" as="span" className={styles.cardTitleIcon}>
              <PaperclipIcon aria-hidden />
            </Text>
            Tài liệu đính kèm
          </Text>
          <div className={styles.attachmentsList}>
            {assignment.attachments.map((att) => {
              const handleDownload = () => {
                if (att.url) {
                  const link = document.createElement("a");
                  link.href = att.url;
                  link.download = att.name;
                  link.target = "_blank";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              };

              const isClickable = att.url != null && att.url !== "";

              return (
                <div 
                  key={att.id} 
                  className={`${styles.attachmentItem} ${isClickable ? styles.attachmentItemClickable : ""}`}
                  onClick={isClickable ? handleDownload : undefined}
                  role={isClickable ? "button" : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onKeyDown={isClickable ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleDownload();
                    }
                  } : undefined}
                  aria-label={isClickable ? `Tải về ${att.name}` : undefined}
                >
                  <Text
                    variant="CAPTION"
                    as="span"
                    className={`${
                      att.type === "pdf"
                        ? styles.attachmentIconPdf
                        : styles.attachmentIconFile
                    } ${styles.attachmentIcon}`}
                    aria-hidden
                  >
                    <DocumentIcon aria-hidden />
                  </Text>
                  <div className={styles.minW0}>
                    <Text variant="BODY.MEDIUM" as="p" className={styles.attachmentName}>
                      {att.name}
                    </Text>
                    <Text variant="BODY.SMALL" as="p" className={styles.attachmentSize}>
                      {att.size}
                    </Text>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      </div>
    </>
  );
}
