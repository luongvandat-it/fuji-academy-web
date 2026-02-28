"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Text } from "@/components/ui";
import { getClassSession, type ClassSessionData } from "@/service/modules/class/logic";
import { getSchedule, type ScheduleData } from "@/service/modules/schedule/logic";
import { ScheduleHeader, SessionModal, ScheduleWeekGrid, ScheduleCalendar, TodaySchedule, MiniCalendar } from "./components";
import type { ScheduleViewMode } from "./components/ScheduleHeader";
import { formatMonthYear, formatWeekRange, getMonthWeeks, getWeekStart, toEvents } from "./utils";
import styles from "./schedule.module.scss";

function getColorClass(_index: number): string {
  return styles.blockBlue;
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<ScheduleViewMode>("week");
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([]);
  const [sessions, setSessions] = useState<ClassSessionData[]>([]);
  const [selectedSession, setSelectedSession] = useState<ClassSessionData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => new Date());
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);

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
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    if (viewMode === "month") {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      setCurrentDate(monthStart);
    }
  }, [viewMode]);

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

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date); // Update currentDate to show correct week
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
    <main className={`${styles.page} schedule-page`} aria-label="Lịch">
      <Text variant="HEADING.ONE" as="h1" className={styles.pageTitle}>
        Lịch
      </Text>
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
        showMonthCalendar={showMonthCalendar}
        onToggleMonthCalendar={() => setShowMonthCalendar(!showMonthCalendar)}
      />
      <div className={styles.scheduleBody}>
        <div className={styles.scheduleSidebar}>
          <MiniCalendar
            currentDate={currentDate}
            selectedDate={selectedDate}
            sessions={sessions}
            events={allEvents}
            onSelectDate={handleSelectDate}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            showMonthView={showMonthCalendar}
          />
        </div>
        <div className={styles.scheduleContent}>
          <div className={styles.desktopView}>
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
          <div className={styles.mobileView}>
            <TodaySchedule
              loading={loading}
              sessions={sessions}
              selectedDate={selectedDate}
              onSessionClick={setSelectedSession}
            />
          </div>
        </div>
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
