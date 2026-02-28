"use client";

import { Text, Loading } from "@/components/ui";
import type { ClassSessionData } from "@/service/modules/class/logic";
import { formatTimeFromDatetime, toDateKey } from "@/app/(dashboard)/schedule/utils";
import styles from "../home.module.scss";

function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  return formatTimeFromDatetime(timeStr);
}

interface TodayScheduleProps {
  loading: boolean;
  sessions: ClassSessionData[];
  onSessionClick?: (session: ClassSessionData) => void;
}

export function TodaySchedule({
  loading,
  sessions,
  onSessionClick,
}: TodayScheduleProps) {
  const today = new Date();
  const todayKey = toDateKey(today);
  const daySessions = sessions.filter((s) => s.date === todayKey);

  const sortedSessions = [...daySessions].sort((a, b) => {
    const timeA = a.start_time || "";
    const timeB = b.start_time || "";
    return timeA.localeCompare(timeB);
  });

  if (loading) {
    return (
      <div className={styles.todayScheduleCard}>
        <div className={styles.loadingState}>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.todayScheduleCard}>
      <div className={styles.todayScheduleHeader}>
        <div className={styles.todayScheduleHeaderLeft}>
          <Text variant="HEADING.TWO" as="h2" className={styles.todayScheduleTitle}>
            Lịch học hôm nay
          </Text>
        </div>
      </div>

      {sortedSessions.length === 0 ? (
        <div className={styles.todayScheduleEmpty}>
          <Text variant="BODY.MEDIUM" as="p">
            Không có lịch học hôm nay
          </Text>
        </div>
      ) : (
        <div className={styles.todayScheduleList}>
          {sortedSessions.map((session) => {
            const startTime = formatTime(session.start_time);
            const now = new Date();
            const sessionStart = session.start_time ? new Date(session.start_time) : null;
            const sessionEnd = session.end_time ? new Date(session.end_time) : null;
            const isLive = sessionStart && sessionEnd && now >= sessionStart && now <= sessionEnd;

            return (
              <div
                key={session.session_id}
                className={styles.todayScheduleItem}
                onClick={() => onSessionClick?.(session)}
              >
                <Text variant="BODY.MEDIUM" as="span" className={styles.todayScheduleTime}>
                  {startTime}
                </Text>
                <div className={styles.todayScheduleContent}>
                  <div className={styles.todayScheduleTitleRow}>
                    <Text variant="BODY.MEDIUM" as="span" className={styles.todayScheduleSubject}>
                      {session.subject_name || session.class_name || session.session_name}
                    </Text>
                    {isLive && (
                      <span className={styles.todayScheduleLiveBadge}>
                        LIVE
                      </span>
                    )}
                  </div>
                  <Text variant="BODY.SMALL" as="p" className={styles.todayScheduleDetails}>
                    {session.classroom_name ? `Phòng ${session.classroom_name}` : "Trực tuyến"} • GV: {session.teacher_name || "Chưa có"}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
