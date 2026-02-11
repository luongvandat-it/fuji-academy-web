"use client";

import { Loading } from "@/components/ui";
import { memo, useMemo } from "react";
import { DAY_LABELS } from "@/app/(dashboard)/schedule/types";
import { buildMonthEventsMap, toDateKey } from "@/app/(dashboard)/schedule/utils";
import styles from "../schedule.module.scss";

export interface ScheduleEvent {
  id: string;
  title: string;
  room: string;
  teacher: string;
  dayIndex: number;
  startHour: number;
  endHour: number;
  colorClass: string;
  startDate?: string;
  endDate?: string;
}

interface ScheduleCalendarProps {
  loading: boolean;
  events: ScheduleEvent[];
  currentDate: Date;
  monthWeeks: Date[][];
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
}: ScheduleCalendarProps) {
  const monthEventsMap = useMemo(() => {
    if (!events.length) return new Map<string, ScheduleEvent[]>();
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);
    return buildMonthEventsMap(events, firstDay, lastDay);
  }, [events, currentDate]);

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
                const eventsForDay = monthEventsMap.get(toDateKey(day)) ?? [];
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
                      {eventsForDay.slice(0, 3).map((ev) => (
                        <div key={ev.id} className={`${styles.block} ${ev.colorClass}`}>
                          {ev.title}
                        </div>
                      ))}
                      {eventsForDay.length > 3 && (
                        <div className={styles.monthMore}>
                          +{eventsForDay.length - 3} more
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
