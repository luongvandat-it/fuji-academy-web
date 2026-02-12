"use client";

import { Loading } from "@/components/ui";
import type { ClassSessionData } from "@/service/modules/class/logic";
import { memo, useMemo } from "react";
import { DAY_LABELS } from "@/app/(dashboard)/schedule/types";
import { buildMonthEventsMap, buildSessionsByDate, formatTimeFromDatetime, toDateKey } from "@/app/(dashboard)/schedule/utils";
import styles from "../schedule.module.scss";

export interface ScheduleEvent {
  id: string;
  title: string;
  room: string;
  teacher: string;
  dayIndex: number;
  startHour: number;
  endHour: number;
  startTime: string;
  endTime: string;
  colorClass: string;
  startDate?: string;
  endDate?: string;
}

interface ScheduleCalendarProps {
  loading: boolean;
  events: ScheduleEvent[];
  currentDate: Date;
  monthWeeks: Date[][];
  sessions?: ClassSessionData[];
  onSessionClick?: (session: ClassSessionData) => void;
}

function isToday(d: Date): boolean {
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

export const ScheduleCalendar = memo(function ScheduleCalendar({
  loading,
  events,
  currentDate,
  monthWeeks,
  sessions = [],
  onSessionClick,
}: ScheduleCalendarProps) {
  const monthEventsMap = useMemo(() => {
    if (!events.length) return new Map<string, ScheduleEvent[]>();
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);
    return buildMonthEventsMap(events, firstDay, lastDay);
  }, [events, currentDate]);

  const sessionsByDate = useMemo(
    () => (sessions.length ? buildSessionsByDate(sessions) : new Map<string, ClassSessionData[]>()),
    [sessions]
  );

  if (loading) {
    return (
      <div className={styles.calendarWrap}>
        <div className={styles.loadingState}>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.calendarWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {DAY_LABELS.map((label: string) => (
              <th key={label} className={styles.dayHeader}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {monthWeeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const today = isToday(day);
                const dateKey = toDateKey(day);
                const sessionsForDay = sessionsByDate.get(dateKey) ?? [];
                const eventsForDay = monthEventsMap.get(dateKey) ?? [];
                const hasSessions = sessionsForDay.length > 0;
                const displayItems = hasSessions
                  ? sessionsForDay.slice(0, 3).map((s) => ({
                      key: `session-${s.session_id}`,
                      time: formatTimeFromDatetime(s.start_time),
                      title: s.subject_name || s.class_name || s.session_name,
                      session: s,
                    }))
                  : eventsForDay.slice(0, 3).map((ev) => ({
                      key: ev.id,
                      time: ev.startTime,
                      title: ev.title,
                      session: null as ClassSessionData | null,
                      colorClass: ev.colorClass,
                    }));
                const moreCount = hasSessions
                  ? Math.max(0, sessionsForDay.length - 3)
                  : Math.max(0, eventsForDay.length - 3);
                return (
                  <td
                    key={di}
                    className={`${styles.monthCell} ${today ? styles.monthCellToday : ""}`}
                  >
                    <div
                      className={
                        isCurrentMonth
                          ? today
                            ? styles.monthCellDayNumToday
                            : styles.monthCellDayNum
                          : styles.monthCellDayNumMuted
                      }
                    >
                      {day.getDate()}
                    </div>
                    <div className={styles.monthCellEvents}>
                      {hasSessions
                        ? displayItems.map((item) => (
                            <button
                              key={item.key}
                              type="button"
                              className={`${styles.block} ${styles.blockBlue} ${styles.blockClickable}`}
                              onClick={() => item.session && onSessionClick?.(item.session)}
                            >
                              <span className={styles.blockTime}>{item.time}</span>
                              <span className={styles.blockTitle}>{item.title}</span>
                            </button>
                          ))
                        : displayItems.map((item) => (
                            <div
                              key={item.key}
                              className={`${styles.block} ${(item as { colorClass?: string }).colorClass ?? styles.blockBlue}`}
                            >
                              <span className={styles.blockTime}>{item.time}</span>
                              <span className={styles.blockTitle}>{item.title}</span>
                            </div>
                          ))}
                      {moreCount > 0 && (
                        <div className={styles.monthMore}>
                          +{moreCount} nữa
                        </div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
