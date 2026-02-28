"use client";

import { Loading } from "@/components/ui";
import type { ClassSessionData } from "@/service/modules/class/logic";
import { memo, useMemo, useState, useEffect, useRef } from "react";
import { DAY_LABELS, TIME_SLOTS } from "@/app/(dashboard)/schedule/types";
import {
  addDays,
  buildDayWeekEventsMap,
  formatTimeFromDatetime,
  isRangeOverlap,
  isToday,
  parseTimeToHours,
  toDateKey,
} from "@/app/(dashboard)/schedule/utils";
import type { ScheduleEvent } from "./ScheduleCalendar";
import { WeekGridDayHeader, WeekGridEventBlock, WeekViewCurrentTimeLine } from "./week";
import styles from "../schedule.module.scss";

const ROW_HEIGHT_PX = 56;
const ROW_STYLE = { height: ROW_HEIGHT_PX } as const;
const DAY_INDICES = [0, 1, 2, 3, 4, 5, 6] as const;
const FIRST_HOUR = TIME_SLOTS[0] ?? 6;
const WEEK_HEADER_HEIGHT_PX = 60;

export type WeekGridEvent = ScheduleEvent & { 
  session?: ClassSessionData;
  startHours?: number; 
  endHours?: number; 
};

interface ScheduleWeekGridProps {
  loading: boolean;
  events: ScheduleEvent[];
  sessions?: ClassSessionData[];
  weekStart: Date;
  onSessionClick?: (session: ClassSessionData) => void;
  getColorClass?: (index: number) => string;
}

function sessionsToWeekEvents(
  weekStart: Date,
  weekEnd: Date,
  sessions: ClassSessionData[],
  getColorClass: (i: number) => string
): WeekGridEvent[] {
  const result: WeekGridEvent[] = [];
  sessions.forEach((s, idx) => {
    const sessionDate = s.date;
    if (!sessionDate || sessionDate < toDateKey(weekStart) || sessionDate > toDateKey(weekEnd))
      return;
    const d = new Date(sessionDate + "T00:00:00");
    const dayIndex = Math.round((d.getTime() - weekStart.getTime()) / 86400000);
    if (dayIndex < 0 || dayIndex > 6) return;
    const startH = parseTimeToHours(s.start_time);
    const endH = parseTimeToHours(s.end_time);
    const startHour = Math.floor(startH);
    const endHour = Math.ceil(endH) || startHour + 1;
    const colorClass = getColorClass(idx);
    result.push({
      id: `session-${s.session_id}`,
      title: s.subject_name || s.class_name || s.session_name,
      room: s.classroom_name || "",
      teacher: s.teacher_name || "",
      dayIndex,
      startHour,
      endHour,
      startHours: startH, 
      endHours: endH, 
      startTime: formatTimeFromDatetime(s.start_time),
      endTime: formatTimeFromDatetime(s.end_time),
      colorClass,
      session: s,
    });
  });
  return result;
}

export const ScheduleWeekGrid = memo(function ScheduleWeekGrid({
  loading,
  events,
  sessions = [],
  weekStart,
  onSessionClick,
  getColorClass = () => styles.blockBlue,
}: ScheduleWeekGridProps) {
  const [now, setNow] = useState(() => new Date());
  const tableRef = useRef<HTMLTableElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(WEEK_HEADER_HEIGHT_PX);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      const thead = tableRef.current.querySelector('thead');
      if (thead) {
        const height = thead.getBoundingClientRect().height;
        setHeaderHeight(height);
      }
    }
  }, []);

  const weekDays = useMemo(
    () => DAY_INDICES.map((i) => addDays(weekStart, i)),
    [weekStart]
  );

  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  const eventsInWeek = useMemo(
    () =>
      events
        .filter((e) =>
          isRangeOverlap(weekStart, weekEnd, e.startDate ?? "", e.endDate ?? "")
        )
        .map((e) => ({
          ...e,
          startHours: parseTimeToHours(e.startTime),
          endHours: parseTimeToHours(e.endTime),
        })),
    [events, weekStart, weekEnd]
  );

  const sessionEvents = useMemo(
    () => sessionsToWeekEvents(weekStart, weekEnd, sessions, getColorClass),
    [weekStart, weekEnd, sessions, getColorClass]
  );

  const mergedEvents: WeekGridEvent[] = useMemo(
    () => [...eventsInWeek, ...sessionEvents],
    [eventsInWeek, sessionEvents]
  );

  const eventsMap = useMemo(
    () => buildDayWeekEventsMap(mergedEvents),
    [mergedEvents]
  );

  const daysWithEvents = useMemo(() => {
    const daysSet = new Set<number>();
    mergedEvents.forEach(event => {
      daysSet.add(event.dayIndex);
    });
    return daysSet;
  }, [mergedEvents]);

  const eventsLayoutMap = useMemo(() => {
    const layoutMap = new Map<string, Map<string, { column: number; totalColumns: number }>>();
    
    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      const dayEvents = mergedEvents.filter(e => e.dayIndex === dayIdx);
      if (dayEvents.length === 0) continue;
      
      const sortedEvents = [...dayEvents].sort((a, b) => {
        const aStart = a.startHours ?? 0;
        const bStart = b.startHours ?? 0;
        return aStart - bStart;
      });
      
      const columns: WeekGridEvent[][] = [];
      const eventToColumn = new Map<string, number>();
      
      for (const event of sortedEvents) {
        const eventStart = event.startHours ?? 0;
        const eventEnd = event.endHours ?? eventStart + 1;
        
        let placed = false;
        for (let colIdx = 0; colIdx < columns.length; colIdx++) {
          const colEvents = columns[colIdx];
          const hasOverlap = colEvents.some(existingEvent => {
            const existingStart = existingEvent.startHours ?? 0;
            const existingEnd = existingEvent.endHours ?? existingStart + 1;
            return !(eventEnd <= existingStart || eventStart >= existingEnd);
          });
          
          if (!hasOverlap) {
            colEvents.push(event);
            eventToColumn.set(event.id, colIdx);
            placed = true;
            break;
          }
        }
        
        if (!placed) {
          columns.push([event]);
          eventToColumn.set(event.id, columns.length - 1);
        }
      }
      
      const dayLayoutMap = new Map<string, { column: number; totalColumns: number }>();
      for (const [eventId, colIdx] of eventToColumn) {
        dayLayoutMap.set(eventId, {
          column: colIdx,
          totalColumns: columns.length,
        });
      }
      
      layoutMap.set(dayIdx.toString(), dayLayoutMap);
    }
    
    return layoutMap;
  }, [mergedEvents]);

  const todayKey = toDateKey(new Date());

  const currentTimeTop = useMemo(() => {
    const today = new Date();
    const todayDateKey = toDateKey(today);
    
    const weekStartKey = toDateKey(weekStart);
    const weekEndKey = toDateKey(weekEnd);
    if (todayDateKey < weekStartKey || todayDateKey > weekEndKey) {
      return null;
    }

    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const totalHours = currentHours + currentMinutes / 60;
    
    const lastHour = TIME_SLOTS[TIME_SLOTS.length - 1] ?? 22;
    if (totalHours < FIRST_HOUR || totalHours >= lastHour + 1) {
      return null;
    }
    
    const hoursFromStart = totalHours - FIRST_HOUR;
    
    const topPosition = headerHeight + (hoursFromStart * ROW_HEIGHT_PX);
    
    return topPosition;
  }, [now, weekStart, weekEnd, headerHeight]);

  useEffect(() => {
    if (!hasScrolled && wrapRef.current && currentTimeTop != null && !loading) {
      const wrap = wrapRef.current;
      const scrollPosition = currentTimeTop - wrap.clientHeight / 2;
      wrap.scrollTop = Math.max(0, scrollPosition);
      setHasScrolled(true);
    }
  }, [currentTimeTop, loading, hasScrolled]);

  useEffect(() => {
    setHasScrolled(false);
  }, [weekStart]);

  if (loading) {
    return (
      <div className={styles.weekGridWrap} ref={wrapRef}>
        <div className={styles.loadingState}>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.weekGridWrap} ref={wrapRef}>
      <div className={styles.weekGrid}>
        <table ref={tableRef} className={styles.weekTable}>
          <thead>
            <tr>
              <th className={styles.weekTimeCol} />
              {weekDays.map((d, i) => (
                <WeekGridDayHeader
                  key={i}
                  dayName={DAY_LABELS[i]}
                  dayNum={d.getDate()}
                  isToday={isToday(d)}
                  hasEvents={daysWithEvents.has(i)}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((hour) => (
              <tr key={hour} style={ROW_STYLE}>
                <td className={styles.weekTimeCell}>
                  {hour.toString().padStart(2, "0")}:00
                </td>
                {DAY_INDICES.map((dayIdx) => {
                  const cellEvents = (eventsMap.get(`${dayIdx}-${hour}`) ?? []) as WeekGridEvent[];
                  const dayLayoutMap = eventsLayoutMap.get(dayIdx.toString());
                  const hasEvents = daysWithEvents.has(dayIdx);
                  return (
                    <td
                      key={dayIdx}
                      className={`${styles.weekCell} ${isToday(weekDays[dayIdx]) ? styles.weekCellToday : ""} ${hasEvents ? styles.weekCellHasEvents : ""}`}
                    >
                      <div className={styles.weekCellInner}>
                        {cellEvents
                          .filter((ev) => {
                            if (ev.startHours == null || ev.endHours == null) return true; 
                            const eventStartHour = Math.floor(ev.startHours);
                            return eventStartHour === hour;
                          })
                          .map((ev) => {
                            const session = ev.session;
                            const isPast = session ? session.date < todayKey : false;
                            const hasAttendance = session?.attendance?.has_attendance === true;
                            const attended = hasAttendance && session?.attendance?.is_present === true;
                            const layout = dayLayoutMap?.get(ev.id);
                            return (
                              <WeekGridEventBlock
                                key={ev.id}
                                id={ev.id}
                                title={ev.title}
                                room={ev.room}
                                teacher={ev.teacher}
                                startTime={ev.startTime}
                                endTime={ev.endTime}
                                colorClass={ev.colorClass}
                                startHours={ev.startHours}
                                endHours={ev.endHours}
                                rowHour={hour}
                                rowHeight={ROW_HEIGHT_PX}
                                column={layout?.column}
                                totalColumns={layout?.totalColumns}
                                onClick={
                                  session && onSessionClick
                                    ? () => onSessionClick(session)
                                    : undefined
                                }
                                isPast={session ? isPast : undefined}
                                attended={isPast && hasAttendance ? attended : undefined}
                              />
                            );
                          })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {currentTimeTop != null && (
          <WeekViewCurrentTimeLine topPx={currentTimeTop} />
        )}
      </div>
    </div>
  );
});

ScheduleWeekGrid.displayName = "ScheduleWeekGrid";
