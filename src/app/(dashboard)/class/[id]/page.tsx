"use client";

import { Loading } from "@/components/ui";
import { ChevronLeftIcon } from "@/icon";
import { getClass } from "@/service/modules/class/logic";
import type { ClassData } from "@/service/modules/class/logic";
import { getExam } from "@/service/modules/exam/logic";
import type { ExamData } from "@/service/modules/exam/logic";
import { getSchedule } from "@/service/modules/schedule/logic";
import type { ScheduleData, ScheduleItem } from "@/service/modules/schedule/logic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ExamModal } from "./components";
import styles from "./classDetail.module.scss";

const LOCALE_VI = "vi-VN";

function formatDate(ymd: string): string {
  const d = new Date(ymd + "T00:00:00");
  return d.toLocaleDateString(LOCALE_VI, { month: "short", day: "numeric", year: "numeric" });
}

const DAY_OF_WEEK_VI: Record<string, string> = {
  monday: "Thứ Hai",
  tuesday: "Thứ Ba",
  wednesday: "Thứ Tư",
  thursday: "Thứ Năm",
  friday: "Thứ Sáu",
  saturday: "Thứ Bảy",
  sunday: "Chủ Nhật",
};

function formatDayLabel(dayOfWeek: string): string {
  const s = (dayOfWeek || "").trim().toLowerCase();
  if (!s) return "";
  return DAY_OF_WEEK_VI[s] ?? s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(LOCALE_VI, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseClassesResponse(res: unknown): ClassData[] {
  if (res && typeof res === "object" && "success" in res && "data" in res) {
    const data = (res as { data: ClassData[] }).data;
    return Array.isArray(data) ? data : [];
  }
  return Array.isArray(res) ? res : [];
}

function parseScheduleResponse(res: unknown, classId: number): ScheduleData | null {
  let list: ScheduleData[] = [];
  if (res && typeof res === "object" && "success" in res && "data" in res) {
    const data = (res as { data: ScheduleData[] }).data;
    list = Array.isArray(data) ? data : [];
  } else if (Array.isArray(res)) {
    list = res as ScheduleData[];
  }
  return list.find((s) => s.class_id === classId) ?? null;
}

function parseExamsResponse(res: unknown): ExamData[] {
  if (res && typeof res === "object" && "success" in res && "data" in res) {
    const data = (res as { data: ExamData[] }).data;
    return Array.isArray(data) ? data : [];
  }
  return Array.isArray(res) ? (res as ExamData[]) : [];
}

export default function ClassDetailPage() {
  const params = useParams();
  const id = params?.id ? String(params.id) : null;
  const classId = id ? parseInt(id, 10) : NaN;

  const [classData, setClassData] = useState<ClassData | null>(null);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [exams, setExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);

  const refreshExams = useCallback(async () => {
    if (!id) return;
    const res = await getExam({ class_id: id });
    setExams(parseExamsResponse(res));
  }, [id]);

  async function loadClassDetail(signal: { cancelled: boolean }) {
    if (!id || Number.isNaN(classId)) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    setLoading(true);
    setNotFound(false);

    try {
      const [classRes, scheduleRes, examRes] = await Promise.all([
        getClass(),
        getSchedule(),
        getExam({ class_id: id }),
      ]);
      if (signal.cancelled) return;

      const classes = parseClassesResponse(classRes);
      const cls = classes.find((c) => c.class_id === classId) ?? null;
      setClassData(cls);
      if (!cls) setNotFound(true);

      setScheduleData(parseScheduleResponse(scheduleRes, classId));
      setExams(parseExamsResponse(examRes));
    } catch {
      if (!signal.cancelled) setNotFound(true);
    } finally {
      if (!signal.cancelled) setLoading(false);
    }
  }

  useEffect(() => {
    const signal = { cancelled: false };
    loadClassDetail(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [id, classId]);

  if (loading) {
    return (
      <div className={styles.page}>
        <Link href="/class" className={styles.backLink} aria-label="Về danh sách lớp">
          <ChevronLeftIcon />
          Quay lại
        </Link>
        <div className={styles.loading}>
          <Loading />
        </div>
      </div>
    );
  }

  if (notFound || !classData) {
    return (
      <div className={styles.page}>
        <Link href="/class" className={styles.backLink} aria-label="Về danh sách lớp">
          <ChevronLeftIcon />
          Quay lại
        </Link>
        <div className={styles.notFound}>Không tìm thấy lớp.</div>
      </div>
    );
  }

  const isOnline = (classData.class_type || "").toLowerCase() === "online";
  const scheduleItems: ScheduleItem[] = scheduleData?.schedules ?? [];

  return (
    <div className={styles.page}>
      <Link href="/class" className={styles.backLink} aria-label="Về danh sách lớp">
        <ChevronLeftIcon />
        Quay lại
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{classData.class_name}</h1>
        <span className={`${styles.badge} ${isOnline ? styles.badgeOnline : styles.badgeOffline}`}>
          {isOnline ? "Trực tuyến" : "Trực tiếp"}
        </span>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Tổng quan</h2>
        <div className={styles.card}>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Môn học</span>
            <span className={styles.rowValue}>{classData.subject_name}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Giáo viên</span>
            <span className={styles.rowValue}>{classData.teacher_name}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Phòng</span>
            <span className={styles.rowValue}>{classData.classroom_name}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Kỳ học</span>
            <span className={styles.rowValue}>
              {formatDate(classData.start_date)} – {formatDate(classData.end_date)}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Học viên</span>
            <span className={styles.rowValue}>
              {classData.student_count} học viên
            </span>
          </div>
        </div>
      </section>

      {scheduleItems.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Lịch học</h2>
          <ul className={styles.scheduleList}>
            {scheduleItems.map((s) => (
              <li key={s.schedule_id} className={styles.scheduleItem}>
                <span className={styles.scheduleDay}>{formatDayLabel(s.day_of_week)}</span>
                <span className={styles.scheduleTime}>
                  {s.start_time} – {s.end_time}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Bài thi</h2>
        {exams.length === 0 ? (
          <p className={styles.examMeta}>Chưa có bài thi cho lớp này.</p>
        ) : (
          <ul className={styles.examList}>
            {exams.map((e) => (
              <li key={e.exam_id}>
                <button
                  type="button"
                  className={styles.examItem}
                  onClick={() => setSelectedExam(e)}
                >
                  <div>
                    <div className={styles.examName}>{e.exam_name}</div>
                    <div className={styles.examMeta}>
                      {formatDateTime(e.open_datetime)} – {formatDateTime(e.close_datetime)}
                      {e.submitted && e.score != null && ` · Điểm: ${e.score}`}
                    </div>
                  </div>
                  <span
                    className={`${styles.examBadge} ${e.submitted ? styles.examBadgeSubmitted : styles.examBadgePending}`}
                  >
                    {e.submitted ? "Đã nộp" : "Chưa nộp"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {selectedExam && (
        <ExamModal
          exam={selectedExam}
          onClose={() => setSelectedExam(null)}
          onSubmitted={refreshExams}
        />
      )}
    </div>
  );
}
