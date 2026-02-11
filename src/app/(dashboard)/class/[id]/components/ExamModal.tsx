"use client";

import { CloseIcon } from "@/icon";
import type { ExamData } from "@/service/modules/exam/logic";
import { submitExam } from "@/service/modules/exam/logic";
import { useRef, useState } from "react";
import styles from "../classDetail.module.scss";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface ExamModalProps {
  exam: ExamData;
  onClose: () => void;
  onSubmitted?: () => void;
}

export function ExamModal({ exam, onClose, onSubmitted }: ExamModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileCount, setFileCount] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const files = fileInputRef.current?.files;
    if (!files?.length) {
      setError("Vui lòng chọn ít nhất một tệp.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await submitExam(exam.exam_id, Array.from(files));
      if (res.success) {
        onSubmitted?.();
        onClose();
      } else {
        setError(res.message || "Nộp bài thất bại. Vui lòng thử lại.");
      }
    } catch {
      setError("Nộp bài thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="exam-modal-title">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 id="exam-modal-title" className={styles.modalTitle}>{exam.exam_name}</h2>
          <button
            type="button"
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Đóng"
          >
            <CloseIcon />
          </button>
        </div>
        <div className={styles.modalBody}>
          <dl className={styles.modalInfo}>
            <div className={styles.modalRow}>
              <dt className={styles.modalLabel}>Lớp</dt>
              <dd className={styles.modalValue}>{exam.class_name}</dd>
            </div>
            <div className={styles.modalRow}>
              <dt className={styles.modalLabel}>Môn học</dt>
              <dd className={styles.modalValue}>{exam.subject_name}</dd>
            </div>
            <div className={styles.modalRow}>
              <dt className={styles.modalLabel}>Mở</dt>
              <dd className={styles.modalValue}>{formatDateTime(exam.open_datetime)}</dd>
            </div>
            <div className={styles.modalRow}>
              <dt className={styles.modalLabel}>Đóng</dt>
              <dd className={styles.modalValue}>{formatDateTime(exam.close_datetime)}</dd>
            </div>
            {exam.submitted && (
              <>
                {exam.score != null && (
                  <div className={styles.modalRow}>
                    <dt className={styles.modalLabel}>Điểm</dt>
                    <dd className={styles.modalValue}>{exam.score}</dd>
                  </div>
                )}
                {exam.comment != null && exam.comment !== "" && (
                  <div className={styles.modalRow}>
                    <dt className={styles.modalLabel}>Nhận xét</dt>
                    <dd className={styles.modalValue}>{exam.comment}</dd>
                  </div>
                )}
              </>
            )}
          </dl>

          {exam.exam_files?.length > 0 && (
            <div className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Tệp đính kèm</h3>
              <ul className={styles.modalFileList}>
                {exam.exam_files.map((f) => (
                  <li key={f.id}>
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className={styles.modalFileLink}>
                      {f.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!exam.submitted && (
            <form onSubmit={handleSubmit} className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Nộp bài</h3>
              <div className={styles.modalFileWrap}>
                <input
                  ref={fileInputRef}
                  id="exam-file-input"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className={styles.modalFileInput}
                  aria-label="Chọn tệp để tải lên"
                  onChange={(e) => setFileCount(e.target.files?.length ?? 0)}
                />
                <label htmlFor="exam-file-input" className={styles.modalFileLabel}>
                  Chọn tệp
                </label>
                <span className={styles.modalFileHint}>
                  {fileCount === 0 ? "Chưa có tệp nào được chọn" : `${fileCount} tệp đã chọn`}
                </span>
              </div>
              {error && <p className={styles.modalError} role="alert">{error}</p>}
              <button type="submit" className={styles.modalSubmit} disabled={submitting}>
                {submitting ? "Đang tải lên..." : "Nộp bài"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
