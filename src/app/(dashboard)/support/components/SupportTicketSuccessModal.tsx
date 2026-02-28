"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Text } from "@/components/ui";
import type { SupportTicketData } from "@/service/modules/support/logic";
import styles from "../support.module.scss";

interface SupportTicketSuccessModalProps {
  ticketData: SupportTicketData;
  onClose: () => void;
}

export function SupportTicketSuccessModal({
  ticketData,
  onClose,
}: SupportTicketSuccessModalProps) {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";

    // Loading bar animation
    const loadingInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // Show content after loading
    const showContentTimer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    // Auto close after 3 seconds
    const closeTimer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearInterval(loadingInterval);
      clearTimeout(showContentTimer);
      clearTimeout(closeTimer);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const submitTime = new Date().toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const modalContent = (
    <div
      className={styles.successModalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      style={{ display: "flex" }}
    >
      <div className={styles.successModal}>
        {!showContent ? (
          <div className={styles.successLoadingContent}>
            <div className={styles.successLoadingBar}>
              <div
                className={styles.successLoadingBarFill}
                style={{ width: `${progress}%` }}
              />
            </div>
            <Text variant="BODY.MEDIUM" className={styles.successLoadingText}>
              Đang gửi yêu cầu...
            </Text>
          </div>
        ) : (
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
              GỬI THÀNH CÔNG!
            </Text>

            <Text variant="BODY.LARGE" className={styles.successMessage}>
              Yêu cầu hỗ trợ của bạn đã được gửi thành công
            </Text>

            <div className={styles.successDetails}>
              <div className={styles.successDetailRow}>
                <Text variant="BODY.MEDIUM" className={styles.successDetailLabel}>
                  Mã yêu cầu:
                </Text>
                <Text variant="BODY.MEDIUM" className={styles.successDetailValue}>
                  {ticketData.name || `#TK-${ticketData.id}`}
                </Text>
              </div>

              <div className={styles.successDetailRow}>
                <Text variant="BODY.MEDIUM" className={styles.successDetailLabel}>
                  Thời gian gửi:
                </Text>
                <Text variant="BODY.MEDIUM" className={styles.successDetailValue}>
                  {submitTime}
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}
