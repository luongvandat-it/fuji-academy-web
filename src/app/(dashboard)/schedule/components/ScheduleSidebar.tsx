"use client";

import { memo, useMemo } from "react";
import { addDays } from "@/app/(dashboard)/schedule/utils";
import styles from "../schedule.module.scss";

interface ScheduleSidebarProps {
  displayMonth: Date;
  weekStart: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: Date) => void;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(d: Date): boolean {
  return isSameDay(d, new Date());
}

function isInWeek(day: Date, weekStart: Date): boolean {
  const weekEnd = addDays(weekStart, 6);
  const t = day.getTime();
  const start = new Date(weekStart);
  start.setHours(0, 0, 0, 0);
  const end = new Date(weekEnd);
  end.setHours(23, 59, 59, 999);
  return t >= start.getTime() && t <= end.getTime();
}

export const ScheduleSidebar = memo(function ScheduleSidebar({
  displayMonth,
  weekStart,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
}: ScheduleSidebarProps) {
  const monthLabel = displayMonth.toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  const monthGrid = useMemo(() => {
    const y = displayMonth.getFullYear();
    const m = displayMonth.getMonth();
    const first = new Date(y, m, 1);
    const sun = first.getDay();
    const start = addDays(first, -sun);
    const weeks: Date[][] = [];
    for (let w = 0; w < 6; w++) {
      const row: Date[] = [];
      for (let d = 0; d < 7; d++) {
        row.push(addDays(start, w * 7 + d));
      }
      weeks.push(row);
    }
    return weeks;
  }, [displayMonth]);

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>Lịch</h2>
      <div className={styles.miniCalendar}>
        <div className={styles.miniCalendarHeader}>
          <span className={styles.miniCalendarMonth}>{monthLabel}</span>
          <div className={styles.miniCalendarNav}>
            <button
              type="button"
              onClick={onPrevMonth}
              className={styles.miniCalendarNavBtn}
              aria-label="Tháng trước"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={onNextMonth}
              className={styles.miniCalendarNavBtn}
              aria-label="Tháng sau"
            >
              ›
            </button>
          </div>
        </div>
        <div className={styles.miniCalendarWeekdays}>
          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((label, i) => (
            <span key={i} className={styles.miniCalendarWeekday}>
              {label}
            </span>
          ))}
        </div>
        <div className={styles.miniCalendarGrid}>
          {monthGrid.map((week, wi) =>
            week.map((day, di) => {
              const inDisplayedWeek = isInWeek(day, weekStart);
              const today = isToday(day);
              const isCurrentMonth = day.getMonth() === displayMonth.getMonth();
              return (
                <button
                  key={`${wi}-${di}`}
                  type="button"
                  onClick={() => onSelectDate(day)}
                  className={`${styles.miniCalendarDay} ${!isCurrentMonth ? styles.miniCalendarDayMuted : ""} ${inDisplayedWeek ? styles.miniCalendarDayInWeek : ""} ${today ? styles.miniCalendarDayToday : ""}`}
                >
                  {day.getDate()}
                </button>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
});
