"use client";

import { CloseIcon, CheckMarkIcon } from "@/icon";
import { Button, Text } from "@/components/ui";
import type { ClassSessionData } from "@/service/modules/class/logic";
import { formatTimeFromDatetime, toDateKey } from "../utils";
import styles from "../schedule.module.scss";

function formatDateVi(ymd: string): string {
  const d = new Date(ymd + "T00:00:00");
  return d.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

interface DayScheduleModalProps {
  date: Date;
  sessions: ClassSessionData[];
  onClose: () => void;
  onSessionClick?: (session: ClassSessionData) => void;
}

export function DayScheduleModal({ date, sessions, onClose, onSessionClick }: DayScheduleModalProps) {
  const dateKey = toDateKey(date);
  const daySessions = sessions.filter(s => s.date === dateKey);
  const todayKey = toDateKey(new Date());

  const sortedSessions = [...daySessions].sort((a, b) => {
    const timeA = a.start_time || "";
    const timeB = b.start_time || "";
    return timeA.localeCompare(timeB);
  });

  const hasSessions = sortedSessions.length > 0;

  return (
    <div
      className={styles.sessionModalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="day-schedule-modal-title"
    >
      <div className={styles.sessionModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.sessionModalHeader}>
          <Text variant="HEADING.TWO" as="h2" id="day-schedule-modal-title" className={styles.sessionModalTitle}>
            Lịch học {formatDateVi(dateKey)}
          </Text>
          <Button
            type="button"
            variant="secondary"
            className={styles.sessionModalClose}
            onClick={onClose}
            aria-label="Đóng"
          >
            <CloseIcon />
          </Button>
        </div>
        <div className={styles.sessionModalBody}>
          {!hasSessions ? (
            <div className={styles.dayScheduleEmpty}>
              <Text variant="BODY.MEDIUM" as="p">
                Không có lịch học trong ngày này
              </Text>
            </div>
          ) : (
            <div className={styles.dayScheduleList}>
              {sortedSessions.map((session) => {
                const startTime = formatTimeFromDatetime(session.start_time);
                const endTime = formatTimeFromDatetime(session.end_time);
                const isPast = session.date < todayKey;
                const hasAttendance = session.attendance?.has_attendance === true;
                const attended = hasAttendance && session.attendance?.is_present === true;

                return (
                  <div
                    key={session.session_id}
                    className={`${styles.dayScheduleItem} ${isPast && hasAttendance && attended ? styles.dayScheduleItemAttended : isPast && hasAttendance && !attended ? styles.dayScheduleItemNotAttended : ""}`}
                    onClick={() => onSessionClick?.(session)}
                  >
                    <div className={styles.dayScheduleItemTime}>
                      <Text variant="BODY.MEDIUM" as="span">
                        {startTime} - {endTime}
                      </Text>
                    </div>
                    <div className={styles.dayScheduleItemContent}>
                      <Text variant="HEADING.THREE" as="h3" className={styles.dayScheduleItemTitle}>
                        {session.subject_name || session.class_name || session.session_name}
                      </Text>
                      <div className={styles.dayScheduleItemMeta}>
                        {session.classroom_name && (
                          <Text variant="BODY.SMALL" as="span">
                            Phòng {session.classroom_name}
                          </Text>
                        )}
                        {session.classroom_name && session.teacher_name && " • "}
                        {session.teacher_name && (
                          <Text variant="BODY.SMALL" as="span">
                            {session.teacher_name}
                          </Text>
                        )}
                      </div>
                      {isPast && (
                        <div className={styles.dayScheduleItemStatus}>
                          {attended ? (
                            <Text variant="BODY.SMALL" as="span" className={styles.dayScheduleItemStatusAttended}>
                              <CheckMarkIcon className={styles.blockCheckIcon} />
                              Đã điểm danh
                            </Text>
                          ) : (
                            <Text variant="BODY.SMALL" as="span" className={styles.dayScheduleItemStatusNotAttended}>
                              Chưa điểm danh
                            </Text>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
