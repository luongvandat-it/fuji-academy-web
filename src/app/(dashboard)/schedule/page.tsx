"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSchedule } from "@/service/modules/schedule/logic";
import type { ScheduleData } from "@/service/modules/schedule/logic";
import {
  ScheduleHeader,
  ScheduleSidebar,
  ScheduleWeekGrid,
} from "./components";
import { addDays, getWeekStart, isRangeOverlap, toEvents } from "./utils";
import styles from "./schedule.module.scss";

const BLOCK_COLORS = [
  styles.blockBlue,
  styles.blockAmber,
  styles.blockGreen,
  styles.blockPurple,
  styles.blockRed,
];

function getColorClass(index: number): string {
  return BLOCK_COLORS[index % BLOCK_COLORS.length] ?? styles.blockBlue;
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([]);
  const [loading, setLoading] = useState(true);

  const weekStart = useMemo(() => getWeekStart(currentDate), [currentDate]);
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSchedule().then((res) => {
      if (cancelled) return;
      setLoading(false);
      if (res.success && "data" in res) setScheduleData(res.data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const allEvents = useMemo(
    () => toEvents(scheduleData, getColorClass),
    [scheduleData]
  );

  const eventsInWeek = useMemo(
    () =>
      allEvents.filter((e) =>
        isRangeOverlap(weekStart, weekEnd, e.startDate ?? "", e.endDate ?? "")
      ),
    [allEvents, weekStart, weekEnd]
  );

  const prevWeek = useCallback(() => {
    setCurrentDate((d) => addDays(d, -7));
  }, []);

  const nextWeek = useCallback(() => {
    setCurrentDate((d) => addDays(d, 7));
  }, []);

  const goToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const displayMonth = useMemo(
    () => new Date(weekStart.getFullYear(), weekStart.getMonth(), 1),
    [weekStart]
  );

  const prevMonth = useCallback(() => {
    setCurrentDate((d) => {
      const next = new Date(d);
      next.setMonth(next.getMonth() - 1);
      return next;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setCurrentDate((d) => {
      const next = new Date(d);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  }, []);

  const handleSelectDate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  return (
    <main className={styles.page} aria-label="Lịch">
      <ScheduleHeader
        weekStart={weekStart}
        onPrev={prevWeek}
        onNext={nextWeek}
        onToday={goToday}
      />
      <div className={styles.scheduleBody}>
        <ScheduleSidebar
          displayMonth={displayMonth}
          weekStart={weekStart}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onSelectDate={handleSelectDate}
        />
        <ScheduleWeekGrid
          loading={loading}
          events={eventsInWeek}
          weekStart={weekStart}
        />
      </div>
    </main>
  );
}
