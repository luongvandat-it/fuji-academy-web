"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Button, Text } from "@/components/ui";
import type { SubmitExamData } from "@/service/modules/exam/logic";
import styles from "../assignmentDetail.module.scss";

interface SubmissionSuccessModalProps {
  submissionData: SubmitExamData;
  examId: number;
  onClose: () => void;
}

export function SubmissionSuccessModal({
  submissionData,
  examId,
  onClose,
}: SubmissionSuccessModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  console.log("SubmissionSuccessModal rendered with:", { submissionData, examId });

  const submissionTime = new Date().toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const submissionCode = `QUIZ-${new Date().getFullYear()}-${String(submissionData.id).padStart(3, "0")}`;

  const handleBackToList = () => {
    router.push("/homework");
  };

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const modalContent = (
    <div
      className={styles.successModalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      style={{ display: "flex" }}
    >
      <div className={styles.successModal}>
        <div className={styles.successModalContent}>
          <div className={styles.successIconWrapper}>
            <div className={styles.successIcon}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

          <Text variant="HEADING.TWO" className={styles.successTitle}>
            CHÚC MỪNG!
          </Text>

          <Text variant="BODY.LARGE" className={styles.successMessage}>
            Bạn đã hoàn thành bài tập!
          </Text>

          <Text variant="BODY.SMALL" className={styles.successDescription}>
            Bài nộp của bạn đã được ghi nhận thành công. Bạn có thể xem kết quả ngay bây giờ hoặc tiếp tục các bài tập khác.
          </Text>

          <div className={styles.successDetails}>
            <div className={styles.successDetailRow}>
              <Text variant="BODY.MEDIUM" className={styles.successDetailLabel}>
                Trạng thái:
              </Text>
              <div className={styles.successDetailValue}>
              <Text variant="CAPTION" as="span" className={styles.successStatusIcon}>
                ✓
              </Text>
              <Text variant="BODY.MEDIUM" as="span" className={styles.successStatusText}>
                Đã nộp
              </Text>
              </div>
            </div>

            <div className={styles.successDetailRow}>
              <Text variant="BODY.MEDIUM" className={styles.successDetailLabel}>
                Thời gian nộp:
              </Text>
              <Text variant="BODY.MEDIUM" className={styles.successDetailValue}>
                {submissionTime}
              </Text>
            </div>

          </div>

          <div className={styles.successActions}>
            <Button
              type="button"
              variant="secondary"
              className={styles.successBackBtn}
              onClick={handleBackToList}
            >
              <Text variant="CAPTION" as="span" className={styles.successBtnIcon}>
                ☰
              </Text>
              Quay lại danh sách
            </Button>
          </div>

          <div className={styles.successFooter}>
            <Text variant="BODY.SMALL" className={styles.successFooterText}>
              Gặp vấn đề?{" "}
              <a href="#" className={styles.successFooterLink}>
                Liên hệ hỗ trợ kỹ thuật
              </a>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}
