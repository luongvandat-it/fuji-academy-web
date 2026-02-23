"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getClassSession, type ClassSessionData } from "@/service/modules/class/logic";
import { getSchedule, type ScheduleData } from "@/service/modules/schedule/logic";
import type { ScheduleViewMode } from "./components/ScheduleHeader";
import { ScheduleCalendar, ScheduleHeader, ScheduleWeekGrid, SessionModal } from "./components";
import { formatMonthYear, formatWeekRange, getMonthWeeks, getWeekStart, toEvents } from "./utils";
import styles from "./schedule.module.scss";

function getColorClass(_index: number): string {
  return styles.blockBlue;
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<ScheduleViewMode>("month");
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([]);
  const [sessions, setSessions] = useState<ClassSessionData[]>([]);
  const [selectedSession, setSelectedSession] = useState<ClassSessionData | null>(null);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const loading = loadingSchedule || loadingSessions;

  const displayMonth = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    [currentDate]
  );

  const monthWeeks = useMemo(() => getMonthWeeks(displayMonth), [displayMonth]);

  const weekStart = useMemo(
    () => getWeekStart(currentDate),
    [currentDate]
  );

  const allEvents = useMemo(
    () => toEvents(scheduleData, getColorClass),
    [scheduleData]
  );

  const goToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

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

  const prevWeek = useCallback(() => {
    setCurrentDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() - 7);
      return next;
    });
  }, []);

  const nextWeek = useCallback(() => {
    setCurrentDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + 7);
      return next;
    });
  }, []);

  const loadSchedule = async () => {
    setLoadingSchedule(true);
    const res = await getSchedule();
    setLoadingSchedule(false);
    if (res.success && "data" in res) setScheduleData(res.data);
  };

  const loadSessions = async () => {
    setLoadingSessions(true);
    const res = await getClassSession();
    setLoadingSessions(false);
    if (res.success && "data" in res) setSessions(res.data);
  };

  useEffect(() => {
    loadSchedule();
    loadSessions();
  }, []);

  return (
    <main className={styles.page} aria-label="Lịch">
      <h1 className={styles.pageTitle}>Lịch</h1>
      <ScheduleHeader
        label={
          viewMode === "month"
            ? formatMonthYear(displayMonth)
            : formatWeekRange(weekStart)
        }
        onPrev={viewMode === "month" ? prevMonth : prevWeek}
        onNext={viewMode === "month" ? nextMonth : nextWeek}
        onToday={goToday}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <div className={styles.scheduleBody}>
        {viewMode === "month" ? (
          <ScheduleCalendar
            loading={loading}
            events={allEvents}
            currentDate={displayMonth}
            monthWeeks={monthWeeks}
            sessions={sessions}
            onSessionClick={setSelectedSession}
          />
        ) : (
          <ScheduleWeekGrid
            loading={loading}
            events={allEvents}
            sessions={sessions}
            weekStart={weekStart}
            onSessionClick={setSelectedSession}
            getColorClass={getColorClass}
          />
        )}
      </div>

      {selectedSession && (
        <SessionModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </main>
  );
}
