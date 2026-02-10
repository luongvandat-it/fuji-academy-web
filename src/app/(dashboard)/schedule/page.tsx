"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { getSchedule } from "@/service/modules/schedule/logic";
import type { ScheduleData } from "@/service/modules/schedule/logic";
import {
  ScheduleCalendar,
  ScheduleHeader,
  ScheduleTabs,
} from "./components";
import type { ViewMode } from "./types";
import {
  addDays,
  getWeekStart,
  isDateInRange,
  isRangeOverlap,
  toEvents,
} from "./utils";
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
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [search, setSearch] = useState("");
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([]);
  const [loading, setLoading] = useState(true);

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

  const weekStart = useMemo(() => getWeekStart(currentDate), [currentDate]);
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);
  const weekDays = useMemo(
    () => [0, 1, 2, 3, 4, 5, 6].map((i) => addDays(weekStart, i)),
    [weekStart]
  );

  const todayIndex = useMemo(() => (new Date().getDay() + 6) % 7, []);
  const isCurrentWeek = useMemo(() => {
    const today = new Date();
    return weekStart.getTime() === getWeekStart(today).getTime();
  }, [weekStart]);

  const dayViewDayIndex = (currentDate.getDay() + 6) % 7;

  const eventsInRange = useMemo(() => {
    if (viewMode === "day") {
      return allEvents.filter(
        (e) =>
          e.dayIndex === dayViewDayIndex &&
          isDateInRange(currentDate, e.startDate, e.endDate)
      );
    }
    if (viewMode === "week") {
      return allEvents.filter((e) =>
        isRangeOverlap(weekStart, weekEnd, e.startDate, e.endDate)
      );
    }
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);
    return allEvents.filter((e) =>
      isRangeOverlap(firstDay, lastDay, e.startDate, e.endDate)
    );
  }, [
    viewMode,
    allEvents,
    currentDate,
    dayViewDayIndex,
    weekStart,
    weekEnd,
  ]);

  const deferredSearch = useDeferredValue(search);
  const filteredEvents = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    if (!q) return eventsInRange;
    return eventsInRange.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.teacher.toLowerCase().includes(q) ||
        e.room.toLowerCase().includes(q)
    );
  }, [eventsInRange, deferredSearch]);

  const prevPeriod = useCallback(() => {
    setCurrentDate((d) => {
      const next = new Date(d);
      if (viewMode === "day") next.setDate(next.getDate() - 1);
      else if (viewMode === "week") next.setDate(next.getDate() - 7);
      else next.setMonth(next.getMonth() - 1);
      return next;
    });
  }, [viewMode]);

  const nextPeriod = useCallback(() => {
    setCurrentDate((d) => {
      const next = new Date(d);
      if (viewMode === "day") next.setDate(next.getDate() + 1);
      else if (viewMode === "week") next.setDate(next.getDate() + 7);
      else next.setMonth(next.getMonth() + 1);
      return next;
    });
  }, [viewMode]);

  const monthWeeks = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const first = new Date(y, m, 1);
    const start = getWeekStart(first);
    const weeks: Date[][] = [];
    for (let w = 0; w < 6; w++) {
      const row: Date[] = [];
      for (let d = 0; d < 7; d++) row.push(addDays(start, w * 7 + d));
      weeks.push(row);
    }
    return weeks;
  }, [currentDate]);

  const daysToShow = useMemo(
    () => (viewMode === "week" ? weekDays : [currentDate]),
    [viewMode, weekDays, currentDate]
  );

  const onViewModeChange = useCallback((mode: ViewMode) => setViewMode(mode), []);

  return (
    <main className={styles.page} aria-label="Schedule">
      <ScheduleHeader
        search={search}
        onSearchChange={setSearch}
        currentDate={currentDate}
        onPrev={prevPeriod}
        onNext={nextPeriod}
      />
      <ScheduleTabs viewMode={viewMode} onViewModeChange={onViewModeChange} />
      <ScheduleCalendar
        loading={loading}
        viewMode={viewMode}
        events={filteredEvents}
        currentDate={currentDate}
        weekDays={weekDays}
        todayIndex={todayIndex}
        isCurrentWeek={isCurrentWeek}
        dayViewDayIndex={dayViewDayIndex}
        daysToShow={daysToShow}
        monthWeeks={monthWeeks}
      />
    </main>
  );
}
