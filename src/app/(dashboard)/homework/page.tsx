"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Text, Loading } from "@/components/ui";
import { getExam } from "@/service/modules/exam/logic";
import type { ExamData } from "@/service/modules/exam/logic";
import {
  AssignmentsSearchBar,
  AssignmentsList,
} from "./components";
import type { Assignment } from "./types";
import styles from "./homework.module.scss";

function parseExamsResponse(res: unknown): ExamData[] {
  if (res && typeof res === "object" && "success" in res && "data" in res) {
    const data = (res as { data: ExamData[] }).data;
    return Array.isArray(data) ? data : [];
  }
  return Array.isArray(res) ? (res as ExamData[]) : [];
}

function convertExamToAssignment(exam: ExamData): Assignment {
  return {
    id: String(exam.exam_id),
    category: exam.subject_name,
    title: exam.exam_name,
    status: exam.submitted ? (exam.score != null ? "graded" : "submitted") : "pending_due",
    dueDate: exam.close_datetime,
    submittedAt: exam.submitted ? exam.close_datetime : undefined,
    score: exam.score ?? undefined,
    maxScore: 10,
    feedback: exam.comment ?? undefined,
  };
}

function filterBySearch(list: Assignment[], q: string): Assignment[] {
  if (!q.trim()) return list;
  const lower = q.trim().toLowerCase();
  return list.filter(
    (a) =>
      a.category.toLowerCase().includes(lower) ||
      a.title.toLowerCase().includes(lower) ||
      (a.description ?? "").toLowerCase().includes(lower)
  );
}

export default function HomeworkPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const signal = { cancelled: false };
    
    async function loadAssignments() {
      setLoading(true);
      try {
        const res = await getExam();
        if (signal.cancelled) return;
        
        const exams = parseExamsResponse(res);
        const converted = exams.map(convertExamToAssignment);
        setAssignments(converted);
      } catch {
        if (!signal.cancelled) {
          setAssignments([]);
        }
      } finally {
        if (!signal.cancelled) {
          setLoading(false);
        }
      }
    }
    
    loadAssignments();
    return () => {
      signal.cancelled = true;
    };
  }, []);

  const filteredAssignments = useMemo(() => {
    return filterBySearch(assignments, searchQuery);
  }, [assignments, searchQuery]);

  const handleSubmit = (id: string) => {
    router.push(`/homework/${id}`);
  };
  const handleDoAssignment = (id: string) => {
    router.push(`/homework/${id}`);
  };
  const handleViewSubmission = (id: string) => {
    router.push(`/homework/${id}`);
  };

  if (loading) {
    return (
      <div className={`${styles.page} homework-page`}>
        <header className={styles.header}>
          <Text variant="HEADING.ONE" as="h1" className={styles.title}>
            Bài tập
          </Text>
        </header>
        <div className={styles.loading}>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.page} homework-page`}>
      <header className={styles.header}>
        <Text variant="HEADING.ONE" as="h1" className={styles.title}>
          Bài tập
        </Text>
      </header>

      <div className={styles.toolbar}>
        <AssignmentsSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Tìm kiếm bài tập..."
        />
      </div>

      <AssignmentsList
        assignments={filteredAssignments}
        onSubmit={handleSubmit}
        onDoAssignment={handleDoAssignment}
        onViewSubmission={handleViewSubmission}
      />
    </div>
  );
}
