"use client";

import { useCallback, useEffect, useState } from "react";
import { Text, Loading } from "@/components/ui";
import { getClassSession, type ClassSessionData } from "@/service/modules/class/logic";
import { getExam, type ExamData } from "@/service/modules/exam/logic";
import { WeeklyStats, TodaySchedule, StudentInfo } from "./components";
import { SessionModal } from "@/app/(dashboard)/schedule/components";
import styles from "./home.module.scss";

function getUserInfo() {
  if (typeof window === "undefined") return null;
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export default function Home() {
  const [sessions, setSessions] = useState<ClassSessionData[]>([]);
  const [exams, setExams] = useState<ExamData[]>([]);
  const [weeklyStats, setWeeklyStats] = useState({
    homeworkCount: 0,
    unsubmittedCount: 0,
  });
  const [selectedSession, setSelectedSession] = useState<ClassSessionData | null>(null);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingExams, setLoadingExams] = useState(true);

  const userInfo = getUserInfo();

  const loadSessions = useCallback(async () => {
    setLoadingSessions(true);
    const res = await getClassSession();
    setLoadingSessions(false);
    if (res.success && "data" in res) {
      setSessions(res.data);
    }
  }, []);

  const loadExams = useCallback(async () => {
    setLoadingExams(true);
    const res = await getExam();
    setLoadingExams(false);
    if (res.success && "data" in res) {
      const examData = Array.isArray(res.data) ? res.data : [];
      setExams(examData);
      
      const unsubmitted = examData.filter((e) => !e.submitted).length;

      setWeeklyStats({
        homeworkCount: examData.length,
        unsubmittedCount: unsubmitted,
      });
    }
  }, []);

  useEffect(() => {
    loadSessions();
    loadExams();
  }, [loadSessions, loadExams]);

  const loading = loadingSessions || loadingExams;

  return (
    <main className={styles.page}>
      <Text variant="HEADING.ONE" as="h1" className={styles.pageTitle}>
        Trang chủ
      </Text>

      {loading ? (
        <div className={styles.loadingState}>
          <Loading />
        </div>
      ) : (
        <div className={styles.contentGrid}>
          <aside className={styles.studentInfoWrapper}>
            <StudentInfo
              name={userInfo?.name || "Học sinh"}
              studentId={userInfo?.id ? String(userInfo.id) : undefined}
              email={userInfo?.email}
            />
          </aside>

          <div className={styles.mainContent}>
            <WeeklyStats
              homeworkCount={weeklyStats.homeworkCount}
              unsubmittedCount={weeklyStats.unsubmittedCount}
            />

            <TodaySchedule
              loading={loadingSessions}
              sessions={sessions}
              onSessionClick={setSelectedSession}
            />
          </div>
        </div>
      )}

      {selectedSession && (
        <SessionModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </main>
  );
}
