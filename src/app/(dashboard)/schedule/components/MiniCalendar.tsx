"use client";

import { memo, useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Button, Text } from "@/components/ui";
import { addDays, getWeekStart, toDateKey } from "../utils";
import styles from "../schedule.module.scss";

interface MiniCalendarProps {
  currentDate: Date;
  selectedDate?: Date | null;
  sessions: Array<{ date: string }>;
  events: Array<{ startDate?: string; endDate?: string; dayIndex: number }>;
  onSelectDate: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  showMonthView?: boolean;
}

function isToday(d: Date): boolean {
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

function isDateInRange(date: Date, startDate: string, endDate: string): boolean {
  if (!startDate || !endDate) return false;
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");
  return d >= start && d <= end;
}

export const MiniCalendar = memo(function MiniCalendar({
  currentDate,
  selectedDate,
  sessions,
  events,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  showMonthView: showMonthViewProp,
}: MiniCalendarProps) {
  const [displayMonth, setDisplayMonth] = useState(() => {
    const d = new Date(currentDate);
    d.setDate(1);
    return d;
  });

  // Sync displayMonth when currentDate changes
  useEffect(() => {
    const d = new Date(currentDate);
    d.setDate(1);
    setDisplayMonth(d);
  }, [currentDate]);
  const [showMonthViewInternal, setShowMonthViewInternal] = useState(false);
  const showMonthView = showMonthViewProp !== undefined ? showMonthViewProp : showMonthViewInternal;
  const weekViewRef = useRef<HTMLDivElement>(null);
  const monthViewRef = useRef<HTMLDivElement>(null);
  const weekScrollRef = useRef<HTMLDivElement>(null);

  const monthLabel = displayMonth.toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  const daysWithSessions = useMemo(() => {
    const set = new Set<string>();
    sessions.forEach(s => {
      set.add(s.date);
    });
    return set;
  }, [sessions]);

  const daysWithEvents = useMemo(() => {
    const set = new Set<string>();
    
    events.forEach(event => {
      if (!event.startDate || !event.endDate) return;
      
      const start = new Date(event.startDate + "T00:00:00");
      const end = new Date(event.endDate + "T00:00:00");
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = (d.getDay() + 6) % 7; 
        if (dayOfWeek === event.dayIndex) {
          set.add(toDateKey(d));
        }
      }
    });
    
    return set;
  }, [events]);

  // Use selectedDate if available, otherwise use currentDate
  const activeDate = selectedDate || currentDate;

  const weekDays = useMemo(() => {
    const weekStart = getWeekStart(activeDate);
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i));
    }
    return days;
  }, [activeDate]);

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

  useEffect(() => {
    const calendarContainer = weekViewRef.current;
    if (!calendarContainer) return;

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = calendarContainer.scrollTop;
        
        if (showMonthViewProp === undefined) {
          if (scrollTop > 80 && !showMonthViewInternal) {
            setShowMonthViewInternal(true);
          } else if (scrollTop <= 80 && showMonthViewInternal) {
            setShowMonthViewInternal(false);
          }
        }
      }, 100);
    };

    calendarContainer.addEventListener("scroll", handleScroll);
    return () => {
      calendarContainer.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [showMonthView]);

  // Function to scroll to today
  const scrollToToday = useCallback(() => {
    const weekScrollContainer = weekScrollRef.current;
    if (!weekScrollContainer) return;

    const today = new Date();
    const todayKey = toDateKey(today);
    const todayIndex = weekDays.findIndex(day => toDateKey(day) === todayKey);
    
    if (todayIndex !== -1) {
      // Wait for DOM to render
      setTimeout(() => {
        const todayButton = weekScrollContainer.children[todayIndex] as HTMLElement;
        if (todayButton) {
          // Scroll to center today's button
          const containerWidth = weekScrollContainer.clientWidth;
          const buttonLeft = todayButton.offsetLeft;
          const buttonWidth = todayButton.offsetWidth;
          const scrollPosition = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
          
          weekScrollContainer.scrollTo({
            left: Math.max(0, scrollPosition),
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [weekDays]);

  // Auto scroll to today in week view when weekDays change
  useEffect(() => {
    scrollToToday();
  }, [scrollToToday]);

  // Auto scroll to today when switching back to week view
  useEffect(() => {
    if (!showMonthView) {
      // When showMonthView changes from true to false, wait for DOM to render then scroll to today
      setTimeout(() => {
        scrollToToday();
      }, 150);
    }
  }, [showMonthView, scrollToToday]);


  const handlePrevMonth = () => {
    const next = new Date(displayMonth);
    next.setMonth(next.getMonth() - 1);
    setDisplayMonth(next);
    onPrevMonth();
  };

  const handleNextMonth = () => {
    const next = new Date(displayMonth);
    next.setMonth(next.getMonth() + 1);
    setDisplayMonth(next);
    onNextMonth();
  };

  const weekdayLabels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div className={styles.miniCalendar} ref={weekViewRef}>
      {/* Week View - Mobile */}
      {!showMonthView && (
        <div className={styles.miniCalendarWeekView}>
          <div className={styles.miniCalendarWeekScroll} ref={weekScrollRef}>
          {weekDays.map((day) => {
            const today = isToday(day);
            const dateKey = toDateKey(day);
            const hasSessions = daysWithSessions.has(dateKey);
            const hasEvents = daysWithEvents.has(dateKey);
            const hasSchedule = hasSessions || hasEvents;
            const isSelected = toDateKey(activeDate) === dateKey;
            // JavaScript getDay(): 0=Sunday, 1=Monday, 2=Tuesday...
            // weekdayLabels: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
            // So dayOfWeek = jsDay directly
            const dayOfWeek = day.getDay();
            const isWeekend = dayOfWeek === 0; // Sunday only

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => onSelectDate(day)}
                className={`${styles.miniCalendarWeekDay} ${isSelected ? styles.miniCalendarWeekDaySelected : ""} ${today ? styles.miniCalendarWeekDayToday : ""} ${isWeekend ? styles.miniCalendarWeekDayWeekend : ""}`}
              >
                <Text variant="BODY.SMALL" as="span" className={styles.miniCalendarWeekDayLabel}>
                  {weekdayLabels[dayOfWeek]}
                </Text>
                <Text variant="BODY.MEDIUM" as="span" className={styles.miniCalendarWeekDayNumber}>
                  {day.getDate()}
                </Text>
              </button>
            );
          })}
          </div>
        </div>
      )}

      {/* Month View - Show when scrolled or toggled */}
      <div 
        ref={monthViewRef}
        className={`${styles.miniCalendarMonthView} ${showMonthView ? styles.miniCalendarMonthViewVisible : ""}`}
      >
        <div className={styles.miniCalendarHeader}>
          <Text variant="BODY.MEDIUM" as="span" className={styles.miniCalendarMonth}>
            {monthLabel}
          </Text>
          <div className={styles.miniCalendarNav}>
            <Button
              type="button"
              variant="secondary"
              onClick={handlePrevMonth}
              className={styles.miniCalendarNavBtn}
              aria-label="Tháng trước"
            >
              ‹
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleNextMonth}
              className={styles.miniCalendarNavBtn}
              aria-label="Tháng sau"
            >
              ›
            </Button>
          </div>
        </div>
        <div className={styles.miniCalendarWeekdays}>
          {weekdayLabels.map((label, i) => (
            <Text key={i} variant="LABEL.SMALL" as="span" className={styles.miniCalendarWeekday}>
              {label}
            </Text>
          ))}
        </div>
        <div className={styles.miniCalendarGrid}>
          {monthGrid.map((week, wi) =>
            week.map((day, di) => {
              const today = isToday(day);
              const isCurrentMonth = day.getMonth() === displayMonth.getMonth();
              const dateKey = toDateKey(day);
              const hasSessions = daysWithSessions.has(dateKey);
              const hasEvents = daysWithEvents.has(dateKey);
              const hasSchedule = hasSessions || hasEvents;
              const isSelected = toDateKey(activeDate) === dateKey;

              return (
                <Button
                  key={`${wi}-${di}`}
                  type="button"
                  variant="secondary"
                  onClick={() => onSelectDate(day)}
                  className={`${styles.miniCalendarDay} ${!isCurrentMonth ? styles.miniCalendarDayMuted : ""} ${today ? styles.miniCalendarDayToday : ""} ${isSelected ? styles.miniCalendarDaySelected : ""} ${hasSchedule ? styles.miniCalendarDayHasSchedule : ""}`}
                  title={hasSchedule ? "Có lịch học" : undefined}
                >
                  {day.getDate()}
                  {hasSchedule && <span className={styles.miniCalendarDayDot} aria-hidden />}
                </Button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
});

MiniCalendar.displayName = "MiniCalendar";
