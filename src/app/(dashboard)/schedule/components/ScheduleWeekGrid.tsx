"use client";

import { Loading } from "@/components/ui";
import type { ClassSessionData } from "@/service/modules/class/logic";
import { memo, useMemo, useState, useEffect } from "react";
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
const WEEK_HEADER_HEIGHT_PX = 52;

export type WeekGridEvent = ScheduleEvent & { session?: ClassSessionData };

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

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const weekDays = useMemo(
    () => DAY_INDICES.map((i) => addDays(weekStart, i)),
    [weekStart]
  );

  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  const eventsInWeek = useMemo(
    () =>
      events.filter((e) =>
        isRangeOverlap(weekStart, weekEnd, e.startDate ?? "", e.endDate ?? "")
      ),
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

  const todayKey = toDateKey(new Date());

  const currentTimeTop = useMemo(() => {
    const hours = now.getHours() + now.getMinutes() / 60;
    if (hours < FIRST_HOUR || hours >= (TIME_SLOTS[TIME_SLOTS.length - 1] ?? 22) + 1)
      return null;
    return WEEK_HEADER_HEIGHT_PX + (hours - FIRST_HOUR) * ROW_HEIGHT_PX;
  }, [now]);

  if (loading) {
    return (
      <div className={styles.weekGridWrap}>
        <div className={styles.loadingState}>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.weekGridWrap}>
      <div className={styles.weekGrid}>
        <table className={styles.weekTable}>
          <thead>
            <tr>
              <th className={styles.weekTimeCol} />
              {weekDays.map((d, i) => (
                <WeekGridDayHeader
                  key={i}
                  dayName={DAY_LABELS[i]}
                  dayNum={d.getDate()}
                  isToday={isToday(d)}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((hour) => (
              <tr key={hour} style={ROW_STYLE}>
                <td className={styles.weekTimeCell}>
                  {hour <= 12 ? hour : hour - 12}:00 {hour < 12 ? "SA" : "CH"}
                </td>
                {DAY_INDICES.map((dayIdx) => {
                  const cellEvents = (eventsMap.get(`${dayIdx}-${hour}`) ?? []) as WeekGridEvent[];
                  return (
                    <td
                      key={dayIdx}
                      className={`${styles.weekCell} ${isToday(weekDays[dayIdx]) ? styles.weekCellToday : ""}`}
                    >
                      <div className={styles.weekCellInner}>
                        {cellEvents.map((ev) => {
                          const session = ev.session;
                          const isPast = session ? session.date < todayKey : false;
                          const attended = session?.attendance?.is_present === true;
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
                              onClick={
                                session && onSessionClick
                                  ? () => onSessionClick(session)
                                  : undefined
                              }
                              isPast={session ? isPast : undefined}
                              attended={isPast ? attended : undefined}
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
