"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DocumentIcon, TrashIcon, UploadCloudIcon } from "@/icon";
import { Button, Text, Loading } from "@/components/ui";
import { submitExam, type SubmitExamData } from "@/service/modules/exam/logic";
import { SubmissionSuccessModal } from "./SubmissionSuccessModal";
import styles from "../assignmentDetail.module.scss";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export interface SubmittedFileItem {
  id: string;
  name: string;
  size?: string;
  type: "file" | "url";
  addedAt: string;
  file?: File;
  url?: string;
}

interface AssignmentSubmissionPanelProps {
  examId: number;
  onConfirm?: () => void;
  onCancel?: () => void;
  onModalClose?: () => void;
}

export function AssignmentSubmissionPanel({
  examId,
  onConfirm,
  onCancel,
  onModalClose,
}: AssignmentSubmissionPanelProps) {
  const [files, setFiles] = useState<SubmittedFileItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmitExamData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fileToItem = useCallback((file: File, i: number, baseId: number): SubmittedFileItem => ({
    id: `f-${baseId}-${i}`,
    name: file.name,
    size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    type: "file",
    addedAt: new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }) + " " + new Date().toLocaleDateString("vi-VN"),
    file,
    url: URL.createObjectURL(file),
  }), []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setError(null);
    const items = Array.from(e.dataTransfer.files);
    if (items.length === 0) return;
    const baseId = Date.now();
    const valid: File[] = [];
    const tooLarge: string[] = [];
    items.forEach((file) => {
      if (file.size > MAX_FILE_SIZE_BYTES) tooLarge.push(file.name);
      else valid.push(file);
    });
    if (tooLarge.length > 0) {
      setError(`Mỗi tệp tối đa 10MB. Các tệp sau bị bỏ qua: ${tooLarge.join(", ")}`);
    }
    const newFiles: SubmittedFileItem[] = valid.map((file, i) => fileToItem(file, i, baseId));
    setFiles((prev) => [...prev, ...newFiles]);
  }, [fileToItem]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleChooseFile = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const items = Array.from(e.target.files ?? []);
      if (items.length === 0) return;
      const baseId = Date.now();
      const valid: File[] = [];
      const tooLarge: string[] = [];
      items.forEach((file) => {
        if (file.size > MAX_FILE_SIZE_BYTES) tooLarge.push(file.name);
        else valid.push(file);
      });
      if (tooLarge.length > 0) {
        setError(`Mỗi tệp tối đa 10MB. Các tệp sau bị bỏ qua: ${tooLarge.join(", ")}`);
      }
      const newFiles: SubmittedFileItem[] = valid.map((file, i) => fileToItem(file, i, baseId));
      setFiles((prev) => [...prev, ...newFiles]);
      e.target.value = "";
    },
    [fileToItem]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.url && fileToRemove.type === "file") {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const handleFileClick = useCallback((file: SubmittedFileItem) => {
    if (file.url) {
      window.open(file.url, "_blank");
    }
  }, []);

  useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (f.url && f.type === "file") {
          URL.revokeObjectURL(f.url);
        }
      });
    };
  }, [files]);

  const handleConfirm = useCallback(async () => {
    if (files.length === 0) {
      setError("Vui lòng chọn ít nhất một tệp để nộp bài.");
      return;
    }

    const fileObjects = files
      .map((f) => f.file)
      .filter((f): f is File => f !== undefined);

    const oversize = fileObjects.filter((f) => f.size > MAX_FILE_SIZE_BYTES);
    if (oversize.length > 0) {
      setError(`Mỗi tệp tối đa 10MB. Vui lòng bỏ các tệp: ${oversize.map((f) => f.name).join(", ")}`);
      return;
    }

    if (fileObjects.length === 0) {
      setError("Không có tệp hợp lệ để nộp bài.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await submitExam(examId, { files: fileObjects });
      console.log("Submit result:", result);
      
      if (result.success === true) {
        console.log("Success! Setting modal state...");
        if ("data" in result && result.data) {
          console.log("Setting submission data:", result.data);
          setSubmissionData(result.data);
          setShowSuccess(true);
          console.log("showSuccess set to true");
          onConfirm?.();
        } else {
          console.log("No data, using fallback");
          setSubmissionData({ id: Date.now(), score: 0, comment: "" });
          setShowSuccess(true);
          onConfirm?.();
        }
      } else {
        const errorResult = result as { success: false; status?: number; message?: string };
        setError(
          errorResult.message || 
          `Lỗi khi nộp bài. ${errorResult.status ? `Mã lỗi: ${errorResult.status}` : ""}`
        );
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Đã xảy ra lỗi không mong muốn khi nộp bài.");
    } finally {
      setSubmitting(false);
    }
  }, [examId, files, onConfirm]);

  console.log("Render - showSuccess:", showSuccess, "submissionData:", submissionData);

  return (
    <>
      {showSuccess && submissionData && (
        <SubmissionSuccessModal
          submissionData={submissionData}
          examId={examId}
          onClose={() => {
            console.log("Closing modal");
            setShowSuccess(false);
            onModalClose?.();
          }}
        />
      )}
      <div className={styles.submissionCard}>
      <Text variant="HEADING.TWO" as="h2" className={styles.cardTitle}>
        Khu vực nộp bài
      </Text>

      <div
        className={styles.dropzone}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <span className={styles.dropzoneIcon}>
          <UploadCloudIcon aria-hidden />
        </span>
        <Text variant="BODY.MEDIUM" className={styles.dropzoneText}>
          Kéo thả file vào đây
        </Text>
        <Text variant="BODY.SMALL" className={styles.dropzoneHint}>
          hoặc nhấn để chọn file từ máy tính (tối đa 10MB mỗi tệp)
        </Text>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="sr-only"
          aria-hidden
          onChange={handleFileInputChange}
        />
        <Button
          type="button"
          variant="primary"
          className={styles.chooseFileBtn}
          onClick={handleChooseFile}
        >
          Chọn tệp tin
        </Button>
      </div>

      <Text variant="LABEL.MEDIUM" className={styles.filesListTitle}>
        DANH SÁCH TỆP ĐÃ CHỌN
      </Text>
      <div className={styles.filesList}>
        {files.length === 0 ? (
          <Text variant="BODY.SMALL" className={styles.emptyStateText}>
            Chưa chọn tệp nào.
          </Text>
        ) : (
          files.map((f) => (
            <div key={f.id} className={styles.fileRow}>
              <div 
                className={styles.fileRowLeft}
                onClick={() => handleFileClick(f)}
                style={{ cursor: f.url ? "pointer" : "default" }}
              >
                <Text
                  variant="CAPTION"
                  as="span"
                  className={
                    f.type === "url"
                      ? styles.fileRowIconLink
                      : styles.fileRowIcon
                  }
                >
                  <DocumentIcon aria-hidden />
                </Text>
                <div className={styles.minW0}>
                  <Text variant="BODY.MEDIUM" className={styles.fileRowName}>
                    {f.name}
                  </Text>
                  <Text variant="BODY.SMALL" className={styles.fileRowMeta}>
                    {f.type === "url" ? "URL" : f.size}
                    {f.addedAt && ` • ${f.addedAt}`}
                  </Text>
                </div>
              </div>
              <Button
                type="button"
                variant="link"
                className={styles.fileRowDelete}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(f.id);
                }}
                aria-label="Xóa tệp"
              >
                <TrashIcon aria-hidden />
              </Button>
            </div>
          ))
        )}
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
          disabled={submitting || files.length === 0}
        >
          {submitting ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <Loading className={styles.submitLoading} />
              Đang nộp bài...
            </span>
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
    </>
  );
}
