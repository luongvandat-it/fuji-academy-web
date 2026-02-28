"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Text, Loading } from "@/components/ui";
import { CloseIcon } from "@/icon";
import { getExam } from "@/service/modules/exam/logic";
import type { ExamData } from "@/service/modules/exam/logic";
import type { AssignmentDetail } from "@/app/(dashboard)/homework/types";
import {
  AssignmentDetailContent,
  AssignmentInputSubmissionPanel,
  AssignmentSubmissionPanel,
} from "./components";
import styles from "./assignmentDetail.module.scss";

function formatDueDate(iso: string): string {
  const d = new Date(iso);
  const time = d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = d.toLocaleDateString("vi-VN");
  return `${time} - ${date}`;
}

function parseExamsResponse(res: unknown): ExamData[] {
  if (res && typeof res === "object" && "success" in res && "data" in res) {
    const data = (res as { data: ExamData[] }).data;
    return Array.isArray(data) ? data : [];
  }
  return Array.isArray(res) ? (res as ExamData[]) : [];
}

function convertExamToAssignmentDetail(exam: ExamData): AssignmentDetail {
  const hasFiles = exam.exam_files && exam.exam_files.length > 0;
  const submissionType: "file" | "input" = hasFiles ? "file" : "input";
  
  return {
    id: String(exam.exam_id),
    category: exam.subject_name,
    title: exam.exam_name,
    status: exam.submitted ? (exam.score != null ? "graded" : "submitted") : "pending_due",
    dueDate: exam.close_datetime,
    submittedAt: exam.submitted ? exam.close_datetime : undefined,
    score: exam.score ?? undefined,
    maxScore: 10,
    submissionType,
    courseName: exam.class_name,
    categoryLabel: exam.subject_name,
    fullDescription: exam.exam_text || exam.comment || "",
    submissionRequirements: hasFiles ? "Nộp file bài thi" : "Nhập nội dung bài làm",
    attachments: exam.exam_files?.map((f) => ({
      id: String(f.id),
      name: f.name,
      size: "",
      type: "file",
      url: f.url,
    })) || [],
    inputLabel: hasFiles ? undefined : "Nội dung bài làm",
    inputPlaceholder: hasFiles ? undefined : "Nhập nội dung bài làm của bạn...",
  };
}

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : null;
  const examId = id ? parseInt(id, 10) : NaN;

  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  async function loadAssignmentDetail(signal: { cancelled: boolean }) {
    if (!id || Number.isNaN(examId)) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    setLoading(true);
    setNotFound(false);

    try {
      const res = await getExam();
      if (signal.cancelled) return;

      const exams = parseExamsResponse(res);
      const exam = exams.find((e) => e.exam_id === examId) ?? null;
      
      if (exam) {
        setAssignment(convertExamToAssignmentDetail(exam));
      } else {
        setNotFound(true);
      }
    } catch {
      if (!signal.cancelled) setNotFound(true);
    } finally {
      if (!signal.cancelled) setLoading(false);
    }
  }

  useEffect(() => {
    const signal = { cancelled: false };
    loadAssignmentDetail(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [id, examId]);

  const handleConfirmFile = async () => {
    console.log("handleConfirmFile called");
    // Don't reload here - let the modal show first
    // Reload will happen after modal is closed
  };

  const handleConfirmInput = async (value: string) => {
    console.log("Confirm input submission", value);
    // Don't reload here - let the modal show first
    // Reload will happen after modal is closed
  };

  const handleModalClose = async () => {
    // Reload assignment after modal is closed
    const signal = { cancelled: false };
    await loadAssignmentDetail(signal);
  };

  const handleCancel = () => {
    router.push("/homework");
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.pageInner}>
          <div className={styles.emptyState}>
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !assignment) {
    return (
      <div className={styles.page}>
        <div className={styles.pageInner}>
          <div className={styles.emptyState}>
            <Text variant="BODY.MEDIUM" as="p" className={styles.emptyStateText}>
              Không tìm thấy bài tập.
            </Text>
            <div className={styles.emptyStateActions}>
              <Link href="/homework" className={styles.cancelBtn}>
                Về danh sách bài tập
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const dueDateFormatted = assignment.dueDate
    ? formatDueDate(assignment.dueDate)
    : "—";

  return (
    <div className={`${styles.page} assignmentDetail-page`}>
      <div className={styles.pageInner}>
        <Button
          type="button"
          variant="secondary"
          className={styles.detailCloseBtn}
          onClick={() => router.push("/homework")}
          title="Đóng và quay về danh sách bài tập"
          aria-label="Đóng và quay về danh sách bài tập"
        >
          <CloseIcon aria-hidden />
        </Button>
        <div className={styles.layout}>
          <aside className={styles.colLeft} aria-label="Đề bài">
            <div className={styles.breadcrumbWrap}>
              <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                <Link href="/homework" className={styles.breadcrumbLink}>
                  <Text variant="BODY.SMALL" as="span">
                    Khóa học
                  </Text>
                </Link>
                <Text variant="CAPTION" as="span" className={styles.breadcrumbSep} aria-hidden>
                  /
                </Text>
                <Link href="/homework" className={styles.breadcrumbLink}>
                  <Text variant="BODY.SMALL" as="span">
                    {assignment.courseName}
                  </Text>
                </Link>
                <Text variant="CAPTION" as="span" className={styles.breadcrumbSep} aria-hidden>
                  /
                </Text>
                <Text variant="BODY.SMALL" as="span" className={styles.breadcrumbCurrent}>
                  Bài tập {assignment.id}
                </Text>
              </nav>
            </div>
            <div className={styles.colLeftContent}>
              <AssignmentDetailContent
                assignment={assignment}
                dueDateFormatted={dueDateFormatted}
              />
            </div>
          </aside>
          <div className={styles.colRight}>
            {assignment.status === "pending_due" ? (
              assignment.submissionType === "input" ? (
                <AssignmentInputSubmissionPanel
                  examId={examId}
                  label={assignment.inputLabel}
                  placeholder={assignment.inputPlaceholder}
                  onConfirm={handleConfirmInput}
                  onCancel={handleCancel}
                  onModalClose={handleModalClose}
                />
              ) : (
                <AssignmentSubmissionPanel
                  examId={examId}
                  onConfirm={handleConfirmFile}
                  onCancel={handleCancel}
                  onModalClose={handleModalClose}
                />
              )
            ) : (
              <div className={styles.submissionCard}>
                <Text variant="HEADING.TWO" as="h2" className={styles.cardTitle}>
                  Trạng thái nộp bài
                </Text>
                <div className={styles.submissionStatus}>
                  {assignment.status === "submitted" && (
                    <>
                      <Text variant="BODY.MEDIUM" as="p" className={styles.statusText}>
                        Bài tập đã được nộp và đang chờ chấm điểm.
                      </Text>
                      {assignment.submittedAt && (
                        <Text variant="BODY.SMALL" as="p" className={styles.submittedAt}>
                          Đã nộp: {new Date(assignment.submittedAt).toLocaleString("vi-VN")}
                        </Text>
                      )}
                      <Button
                        type="button"
                        variant="primary"
                        className={styles.actionBtn}
                        onClick={() => {
                          // Reset status to allow resubmission
                          setAssignment({ ...assignment, status: "pending_due" });
                        }}
                      >
                        Làm lại bài
                      </Button>
                    </>
                  )}
                  {assignment.status === "graded" && (
                    <>
                      <Text variant="BODY.MEDIUM" as="p" className={styles.statusText}>
                        Bài tập đã được chấm điểm.
                      </Text>
                      {assignment.score != null && (
                        <Text variant="HEADING.TWO" as="p" className={styles.scoreDisplay}>
                          Điểm: {assignment.score}{assignment.maxScore != null ? `/${assignment.maxScore}` : ""}
                        </Text>
                      )}
                      {assignment.submittedAt && (
                        <Text variant="BODY.SMALL" as="p" className={styles.submittedAt}>
                          Đã nộp: {new Date(assignment.submittedAt).toLocaleString("vi-VN")}
                        </Text>
                      )}
                      <Button
                        type="button"
                        variant="primary"
                        className={styles.actionBtn}
                        onClick={() => {
                          // Reset status to allow resubmission
                          setAssignment({ ...assignment, status: "pending_due" });
                        }}
                      >
                        Làm lại bài
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
