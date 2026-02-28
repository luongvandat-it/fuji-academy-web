"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Text, Loading } from "@/components/ui";
import { submitExam, type SubmitExamData } from "@/service/modules/exam/logic";
import { SubmissionSuccessModal } from "./SubmissionSuccessModal";
import styles from "../assignmentDetail.module.scss";

interface AssignmentInputSubmissionPanelProps {
  examId: number;
  label?: string;
  placeholder?: string;
  onConfirm?: (value: string) => void;
  onCancel?: () => void;
  onModalClose?: () => void;
}

export function AssignmentInputSubmissionPanel({
  examId,
  label = "Nội dung bài làm",
  placeholder = "Nhập nội dung vào đây...",
  onConfirm,
  onCancel,
  onModalClose,
}: AssignmentInputSubmissionPanelProps) {
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmitExamData | null>(null);
  const [suspectedAiUsed, setSuspectedAiUsed] = useState(false);

  const charCount = value.length;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }, []);

  const markSuspected = useCallback(() => {
    console.log("dangerous");
    setSuspectedAiUsed(true);
  }, []);

  const handlePaste = useCallback(() => {
    markSuspected();
  }, [markSuspected]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        markSuspected();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [markSuspected]);

  const handleConfirm = useCallback(async () => {
    if (!value.trim()) {
      setError("Vui lòng nhập nội dung bài làm.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await submitExam(examId, {
        answerText: value,
        suspectedAiUsed,
        aiSuspicionDetails: suspectedAiUsed ? "ai" : undefined,
      });

      if (result.success === true) {
        if ("data" in result && result.data) {
          setSubmissionData(result.data);
          setShowSuccess(true);
          onConfirm?.(value);
        } else {
          setSubmissionData({ id: Date.now(), score: 0, comment: "" });
          setShowSuccess(true);
          onConfirm?.(value);
        }
      } else {
        const errorResult = result as { success: false; status?: number; message?: string };
        setError(
          errorResult.message ||
            `Lỗi khi nộp bài. ${errorResult.status ? `Mã lỗi: ${errorResult.status}` : ""}`
        );
      }
    } catch (err) {
      console.error("Submit text error:", err);
      setError("Đã xảy ra lỗi không mong muốn khi nộp bài.");
    } finally {
      setSubmitting(false);
    }
  }, [examId, value, suspectedAiUsed, onConfirm]);

  return (
    <>
      {showSuccess && submissionData && (
        <SubmissionSuccessModal
          submissionData={submissionData}
          examId={examId}
          onClose={() => {
            setShowSuccess(false);
            onModalClose?.();
          }}
        />
      )}
      <div className={`${styles.submissionCard} ${styles.submissionCardTall}`}>
        <Text variant="HEADING.TWO" as="h2" className={styles.cardTitle}>
          Khu vực nộp bài
        </Text>
        <div className={styles.submissionCardBody}>
          <Text variant="LABEL.MEDIUM" as="label" className={styles.inputLabel}>
            {label}
          </Text>
          <div className={styles.inputWrapper}>
            <textarea
              value={value}
              onChange={handleChange}
              onPaste={handlePaste}
              placeholder={placeholder}
              className={styles.submissionTextarea}
              rows={8}
              aria-label={label}
            />
            <Text variant="BODY.SMALL" className={styles.inputCharHint}>
              {charCount} ký tự
            </Text>
          </div>
          {error && (
            <div className={styles.errorMessage}>
              <Text variant="BODY.SMALL" className={styles.errorText}>
                {error}
              </Text>
            </div>
          )}
          <div className={styles.submitActions}>
            <Button
              type="button"
              variant="primary"
              className={styles.submitBtn}
              onClick={handleConfirm}
              disabled={submitting || !value.trim()}
            >
              {submitting ? (
                <>
                  <Loading className={styles.submitLoading} />
                  <Text variant="BUTTON_LABEL.MEDIUM" as="span">
                    Đang nộp bài...
                  </Text>
                </>
              ) : (
                "Xác nhận nộp bài"
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className={styles.cancelBtn}
              onClick={onCancel}
              disabled={submitting}
            >
              Hủy bỏ
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
