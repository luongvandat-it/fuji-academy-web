"use client";

import { memo, useMemo } from "react";
import type { ViewMode } from "@/app/(dashboard)/schedule/types";
import { DAY_LABELS, TIME_SLOTS } from "@/app/(dashboard)/schedule/types";
import {
  buildDayWeekEventsMap,
  buildMonthEventsMap,
  toDateKey,
} from "@/app/(dashboard)/schedule/utils";
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
  viewMode: ViewMode;
  events: ScheduleEvent[];
  currentDate: Date;
  weekDays: Date[];
  todayIndex: number;
  isCurrentWeek: boolean;
  dayViewDayIndex: number;
  daysToShow: Date[];
  monthWeeks: Date[][];
}

export const ScheduleCalendar = memo(function ScheduleCalendar({
  loading,
  viewMode,
  events,
  currentDate,
  weekDays,
  todayIndex,
  isCurrentWeek,
  dayViewDayIndex,
  daysToShow,
  monthWeeks,
}: ScheduleCalendarProps) {
  const monthEventsMap = useMemo(() => {
    if (viewMode !== "month" || !events.length) return new Map<string, ScheduleEvent[]>();
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);
    return buildMonthEventsMap(events, firstDay, lastDay);
  }, [viewMode, events, currentDate]);

  const dayWeekEventsMap = useMemo(
    () => (viewMode !== "month" ? buildDayWeekEventsMap(events) : new Map<string, ScheduleEvent[]>()),
    [viewMode, events]
  );

  if (loading) {
    return (
      <div className={styles.calendarWrap}>
        <div className={styles.loadingState}>
          Loading schedule...
        </div>
      </div>
    );
  }

  if (viewMode === "month") {
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
                  const eventsForDay = monthEventsMap.get(toDateKey(day)) ?? [];
                  return (
                    <td key={di} className={styles.monthCell}>
                      <div
                        className={isCurrentMonth ? styles.monthCellDayNum : styles.monthCellDayNumMuted}
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
  }

  return (
    <div className={styles.calendarWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.timeCell}>Time</th>
            {viewMode === "week" &&
              daysToShow.map((d, i) => (
                <th
                  key={i}
                  className={`${styles.dayHeader} ${i === todayIndex && isCurrentWeek ? styles.dayHeaderToday : ""}`}
                >
                  {DAY_LABELS[i]} {d.getDate()}
                </th>
              ))}
            {viewMode === "day" && (
              <th className={styles.dayHeader}>
                {currentDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map((hour: number) => (
            <tr key={hour}>
              <td className={styles.timeCell}>
                {hour <= 12 ? hour : hour - 12}:00 {hour < 12 ? "AM" : "PM"}
              </td>
              {(viewMode === "day"
                ? [dayViewDayIndex]
                : daysToShow.map((_, i) => i)
              ).map((dayIdx) => {
                const cellEvents = dayWeekEventsMap.get(`${dayIdx}-${hour}`) ?? [];
                return (
                  <td key={dayIdx}>
                    <div className={styles.cellInner}>
                      {cellEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className={`${styles.block} ${ev.colorClass}`}
                        >
                          <div className={styles.blockTitle}>{ev.title}</div>
                          <div className={styles.blockMeta}>
                            {ev.room && `Room ${ev.room}`}
                            {ev.room && ev.teacher ? " • " : ""}
                            {ev.teacher}
                          </div>
                        </div>
                      ))}
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
