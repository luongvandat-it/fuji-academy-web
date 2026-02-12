"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getClassSession, type ClassSessionData } from "@/service/modules/class/logic";
import { getSchedule, type ScheduleData } from "@/service/modules/schedule/logic";
import { ScheduleCalendar, ScheduleHeader, SessionModal } from "./components";
import { formatMonthYear, getMonthWeeks, toEvents } from "./utils";
import styles from "./schedule.module.scss";

function getColorClass(_index: number): string {
  return styles.blockBlue;
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
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
        label={formatMonthYear(displayMonth)}
        onPrev={prevMonth}
        onNext={nextMonth}
        onToday={goToday}
      />
      <div className={styles.scheduleBody}>
        <ScheduleCalendar
          loading={loading}
          events={allEvents}
          currentDate={displayMonth}
          monthWeeks={monthWeeks}
          sessions={sessions}
          onSessionClick={setSelectedSession}
        />
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
