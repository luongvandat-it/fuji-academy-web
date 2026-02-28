"use client";

import { useState, useCallback } from "react";
import { Button, Input, Select, Text } from "@/components/ui";
import { submitSupportTicket, type SupportTicketData } from "@/service/modules/support/logic";
import { SupportTicketSuccessModal } from "./SupportTicketSuccessModal";
import styles from "../support.module.scss";

export interface SubmitSupportFormProps {
  onSuccess?: () => void;
}

const TICKET_TYPES = [
  { value: "academic", label: "Học tập" },
  { value: "technical", label: "Kỹ thuật" },
  { value: "administrative", label: "Hành chính" },
  { value: "other", label: "Khác" },
] as const;

const PRIORITIES = [
  { value: "0", label: "Thấp" },
  { value: "1", label: "Trung bình" },
  { value: "2", label: "Cao" },
  { value: "3", label: "Khẩn cấp" },
] as const;

export function SubmitSupportForm({ onSuccess }: SubmitSupportFormProps) {
  const [subject, setSubject] = useState("");
  const [ticketType, setTicketType] = useState<"academic" | "technical" | "administrative" | "other">("technical");
  const [priority, setPriority] = useState<"0" | "1" | "2" | "3">("0");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicketData | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim()) {
      setError("Vui lòng nhập tiêu đề yêu cầu.");
      return;
    }
    
    if (!description.trim()) {
      setError("Vui lòng nhập mô tả chi tiết.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await submitSupportTicket({
        subject,
        description,
        ticket_type: ticketType,
        priority,
      });

      if (result.success === true) {
        const ticketData = result.data || {
          id: Date.now(),
          name: `TK-${Date.now()}`,
          subject,
          description,
          resolution: null,
          ticket_type: ticketType,
          priority,
          state: "draft" as const,
          is_late: false,
          class_id: null,
          class_name: null,
          teacher_id: null,
          teacher_name: null,
          deadline: null,
          create_date: new Date().toISOString(),
          resolved_date: null,
        };
        
        setSubmittedTicket(ticketData);
        setShowSuccessModal(true);
        setSubject("");
        setTicketType("technical");
        setPriority("0");
        setDescription("");
      } else {
        const errorResult = result as { success: false; status?: number; message?: string };
        setError(
          errorResult.message || 
          `Lỗi khi gửi yêu cầu. ${errorResult.status ? `Mã lỗi: ${errorResult.status}` : ""}`
        );
      }
    } catch (err) {
      console.error("Submit support ticket error:", err);
      setError("Đã xảy ra lỗi không mong muốn khi gửi yêu cầu.");
    } finally {
      setSubmitting(false);
    }
  }, [subject, ticketType, priority, description, onSuccess]);

  return (
    <>
    <form onSubmit={handleSubmit} className={styles.formCard}>
      <div className={styles.formHeader}>
        <div className={styles.formHeaderIcon}>?</div>
        <Text variant="HEADING.TWO" as="h2" className={styles.formTitle}>
          Gửi yêu cầu hỗ trợ
        </Text>
      </div>

      <div className={styles.formFields}>
        <Input
          label="Tiêu đề"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Nhập tiêu đề yêu cầu"
          disabled={submitting}
          error={error && !subject.trim() ? error : undefined}
        />

        <Select
          label="Loại yêu cầu"
          value={ticketType}
          onChange={(e) => setTicketType(e.target.value as typeof ticketType)}
          options={TICKET_TYPES}
          disabled={submitting}
        />

        <div className={styles.fieldGroup}>
          <Text variant="LABEL.MEDIUM" as="label" className={styles.label}>
            Mức độ ưu tiên
          </Text>
          <div className={styles.priorityButtons}>
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`${styles.priorityButton} ${
                  p.value === "3" ? styles.priorityButtonUrgent : ""
                } ${priority === p.value ? styles.priorityButtonActive : ""}`}
                disabled={submitting}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <Text variant="LABEL.MEDIUM" as="label" className={styles.label}>
            Mô tả
          </Text>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
            className={styles.textarea}
            rows={6}
            disabled={submitting}
          />
          {error && !description.trim() && (
            <Text variant="BODY.SMALL" as="p" className={styles.errorText} role="alert">
              {error}
            </Text>
          )}
        </div>

        {error && (subject.trim() && description.trim()) && (
          <Text variant="BODY.SMALL" as="p" className={styles.errorText} role="alert">
            {error}
          </Text>
        )}
      </div>

      <Button type="submit" disabled={submitting} className={styles.submitButton}>
        {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
      </Button>
    </form>
    {showSuccessModal && submittedTicket && (
      <SupportTicketSuccessModal
        ticketData={submittedTicket}
        onClose={() => {
          setShowSuccessModal(false);
          setSubmittedTicket(null);
          onSuccess?.();
        }}
      />
    )}
    </>
  );
}
