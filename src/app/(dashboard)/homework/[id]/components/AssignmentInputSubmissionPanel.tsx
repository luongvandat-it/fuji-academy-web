"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { Button, Text, Loading } from "@/components/ui";
import { submitExam, type SubmitExamData } from "@/service/modules/exam/logic";
import { SubmissionSuccessModal } from "./SubmissionSuccessModal";
import styles from "../assignmentDetail.module.scss";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

interface AssignmentInputSubmissionPanelProps {
  examId: number;
  label?: string;
  placeholder?: string;
  onConfirm?: (value: string) => void;
  onCancel?: () => void;
  onModalClose?: () => void;
}

const createModules = (handleImageUpload: () => void) => ({
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "image"],
      ["clean"],
    ],
    handlers: {
      image: handleImageUpload,
    },
  },
  clipboard: {
    matchVisual: false,
  },
});

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "color",
  "background",
  "link",
  "image",
];

export function AssignmentInputSubmissionPanel({
  examId,
  label = "Nội dung bài làm",
  placeholder = "Nhập nội dung vào đây...",
  onConfirm,
  onCancel,
  onModalClose,
}: AssignmentInputSubmissionPanelProps) {
  const [value, setValue] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmitExamData | null>(null);
  const [suspectedAiUsed, setSuspectedAiUsed] = useState(false);
  const lastCharCountRef = useRef(0);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const handleImageInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result as string;
        const quill = (document.querySelector(".ql-editor") as any)?.__quill;
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", src);
          quill.setSelection(range.index + 1);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    []
  );

  const handleChange = useCallback((content: string) => {
    setValue(content);
    
    const text = content.replace(/<[^>]*>/g, "").trim();
    const newCharCount = text.length;

    lastCharCountRef.current = newCharCount;
    setCharCount(newCharCount);
  }, []);

  const quillModules = createModules(handleImageUpload);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    let cleanup: (() => void) | null = null;
    
    const timer = setTimeout(() => {
      const editorElement = document.querySelector(".ql-editor");
      if (!editorElement) return;

      const handlePaste = (e: ClipboardEvent) => {
        console.log("dangerous");
        setSuspectedAiUsed(true);
      };

      editorElement.addEventListener("paste", handlePaste as EventListener, true);
      window.addEventListener("paste", handlePaste, true);
      
      cleanup = () => {
        editorElement.removeEventListener("paste", handlePaste as EventListener, true);
        window.removeEventListener("paste", handlePaste, true);
      };
    }, 500);

    return () => {
      clearTimeout(timer);
      if (cleanup) cleanup();
    };
  }, [value]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === "hidden") {
        console.log("dangerous");
        setSuspectedAiUsed(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

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
        suspectedAiUsed: suspectedAiUsed,
        aiSuspicionDetails: suspectedAiUsed ? "ai" : undefined,
      });
      console.log("Submit text result:", result);
      
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
  }, [examId, value, onConfirm]);

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
            <div className={styles.quillWrapper}>
              <ReactQuill
                theme="snow"
                value={value}
                onChange={handleChange}
                modules={quillModules}
                formats={formats}
                placeholder={placeholder}
                className={styles.quillEditor}
              />
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                aria-hidden
                onChange={handleImageInputChange}
              />
            </div>
          </div>
          <Text variant="BODY.SMALL" className={styles.inputCharHint}>
            {charCount} ký tự
          </Text>
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
