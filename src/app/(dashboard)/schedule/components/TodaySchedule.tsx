"use client";

import { CheckMarkIcon, CloseIcon } from "@/icon";
import { Text, Loading } from "@/components/ui";
import type { ClassSessionData } from "@/service/modules/class/logic";
import { formatTimeFromDatetime, toDateKey } from "../utils";
import styles from "../schedule.module.scss";

function formatDateVi(date: Date): string {
  return date.toLocaleDateString("vi-VN", { 
    weekday: "long", 
    day: "numeric", 
    month: "long", 
    year: "numeric" 
  });
}

function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const time = formatTimeFromDatetime(timeStr);
  return time;
}

function getClassTypeLabel(classType: string): string {
  const typeMap: Record<string, string> = {
    theory: "LÝ THUYẾT",
    practice: "THỰC HÀNH",
    lab: "THỰC HÀNH",
  };
  return typeMap[classType?.toLowerCase()] || classType?.toUpperCase() || "LÝ THUYẾT";
}

interface TodayScheduleProps {
  loading: boolean;
  sessions: ClassSessionData[];
  selectedDate?: Date | null; 
  onSessionClick?: (session: ClassSessionData) => void;
}

export function TodaySchedule({ loading, sessions, selectedDate, onSessionClick }: TodayScheduleProps) {
  const displayDate = selectedDate || new Date();
  const dateKey = toDateKey(displayDate);
  const daySessions = sessions.filter(s => s.date === dateKey);

  const sortedSessions = [...daySessions].sort((a, b) => {
    const timeA = a.start_time || "";
    const timeB = b.start_time || "";
    return timeA.localeCompare(timeB);
  });

  const today = new Date();
  const todayKey = toDateKey(today);
  const isToday = dateKey === todayKey;

  if (loading) {
    return (
      <div className={styles.todayScheduleWrap}>
        <div className={styles.loadingState}>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.todayScheduleWrap}>
      <div className={styles.todayScheduleHeader}>
        <div className={styles.todayScheduleHeaderTop}>
          <Text variant="HEADING.TWO" as="h2" className={styles.todayScheduleTitle}>
            {isToday ? "Lịch học hôm nay" : "Lịch học"}
          </Text>
          {sortedSessions.length > 0 && (
            <Text variant="BODY.SMALL" as="span" className={styles.todayScheduleCount}>
              {sortedSessions.length} buổi học
            </Text>
          )}
        </div>
        <Text variant="BODY.SMALL" as="p" className={styles.todayScheduleDate}>
          {formatDateVi(displayDate)}
        </Text>
      </div>

      {sortedSessions.length === 0 ? (
        <div className={styles.todayScheduleEmpty}>
          <Text variant="BODY.MEDIUM" as="p">
            {isToday ? "Không có lịch học hôm nay" : "Không có lịch học trong ngày này"}
          </Text>
        </div>
      ) : (
        <div className={styles.todayScheduleList}>
          {sortedSessions.map((session) => {
            const startTime = formatTime(session.start_time);
            const endTime = formatTime(session.end_time);
            const isPast = session.date < todayKey;
            const isUpcoming = !isPast;
            const hasAttendance = session.attendance?.has_attendance === true;
            const attended = hasAttendance && session.attendance?.is_present === true;
            const absent = hasAttendance && session.attendance?.is_absent === true;
            
            const classTypeLabel = getClassTypeLabel(session.class_type || "");
            const isTheory = classTypeLabel === "LÝ THUYẾT";

            return (
              <div
                key={session.session_id}
                className={`${styles.todayScheduleItem} ${isUpcoming ? styles.todayScheduleItemUpcoming : ""} ${isPast && hasAttendance && attended ? styles.todayScheduleItemAttended : ""} ${isPast && hasAttendance && absent ? styles.todayScheduleItemAbsent : ""}`}
                onClick={() => onSessionClick?.(session)}
              >
                {isUpcoming && <div className={styles.todayScheduleItemBar} />}
                <div className={styles.todayScheduleItemTime}>
                  <Text variant="HEADING.THREE" as="span" className={`${styles.todayScheduleStartTime} ${isUpcoming ? styles.todayScheduleStartTimeUpcoming : ""}`}>
                    {startTime}
                  </Text>
                  <Text variant="BODY.SMALL" as="span" className={styles.todayScheduleEndTime}>
                    {endTime}
                  </Text>
                </div>
                <div className={styles.todayScheduleItemContent}>
                  <div className={styles.todayScheduleItemBadges}>
                    <span className={`${styles.todayScheduleClassTypeBadge} ${isTheory ? styles.todayScheduleClassTypeBadgeTheory : styles.todayScheduleClassTypeBadgePractice}`}>
                      {classTypeLabel}
                    </span>
                    {isPast && hasAttendance && (
                      <span className={`${styles.todayScheduleStatusBadge} ${attended ? styles.todayScheduleStatusBadgeAttended : styles.todayScheduleStatusBadgeAbsent}`}>
                        {attended ? "✓ Đã học" : "Vắng mặt"}
                      </span>
                    )}
                    {isUpcoming && (
                      <span className={`${styles.todayScheduleStatusBadge} ${styles.todayScheduleStatusBadgeUpcoming}`}>
                        Sắp diễn ra
                      </span>
                    )}
                  </div>
                  <Text variant="HEADING.THREE" as="h3" className={`${styles.todayScheduleItemTitle} ${isPast && hasAttendance && absent ? styles.todayScheduleItemTitleMuted : ""}`}>
                    {session.subject_name || session.class_name || session.session_name}
                  </Text>
                  <Text variant="BODY.SMALL" as="p" className={`${styles.todayScheduleItemMeta} ${isPast && hasAttendance && absent ? styles.todayScheduleItemMetaMuted : ""}`}>
                    GV: {session.teacher_name || "Chưa có"}
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
