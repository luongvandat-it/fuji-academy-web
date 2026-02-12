"use client";

import { Loading } from "@/components/ui";
import { memo, useMemo, useState, useEffect } from "react";
import { DAY_LABELS, TIME_SLOTS } from "@/app/(dashboard)/schedule/types";
import { addDays, buildDayWeekEventsMap, isRangeOverlap } from "@/app/(dashboard)/schedule/utils";
import type { ScheduleEvent } from "./ScheduleCalendar";
import styles from "../schedule.module.scss";

const ROW_HEIGHT_PX = 56;
const ROW_STYLE = { height: ROW_HEIGHT_PX } as const;
const DAY_INDICES = [0, 1, 2, 3, 4, 5, 6] as const;
const FIRST_HOUR = TIME_SLOTS[0] ?? 6;
const WEEK_HEADER_HEIGHT_PX = 52;

interface ScheduleWeekGridProps {
  loading: boolean;
  events: ScheduleEvent[];
  weekStart: Date;
}

function isToday(d: Date): boolean {
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}

export const ScheduleWeekGrid = memo(function ScheduleWeekGrid({
  loading,
  events,
  weekStart,
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

  const eventsMap = useMemo(
    () => buildDayWeekEventsMap(eventsInWeek),
    [eventsInWeek]
  );

  const currentTimeTop = useMemo(() => {
    const hours = now.getHours() + now.getMinutes() / 60;
    if (hours < FIRST_HOUR || hours >= (TIME_SLOTS[TIME_SLOTS.length - 1] ?? 22) + 1)
      return null;
    return WEEK_HEADER_HEIGHT_PX + (hours - FIRST_HOUR) * ROW_HEIGHT_PX;
  }, [now]);

  const currentTimeLineStyle = useMemo(
    () => (currentTimeTop != null ? { top: currentTimeTop } : undefined),
    [currentTimeTop]
  );

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
                <th
                  key={i}
                  className={`${styles.weekDayHeader} ${isToday(d) ? styles.weekDayHeaderToday : ""}`}
                >
                  <span className={styles.weekDayName}>{DAY_LABELS[i]}</span>
                  <span className={styles.weekDayNum}>{d.getDate()}</span>
                </th>
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
                  const cellEvents = eventsMap.get(`${dayIdx}-${hour}`) ?? [];
                  return (
                    <td
                      key={dayIdx}
                      className={`${styles.weekCell} ${isToday(weekDays[dayIdx]) ? styles.weekCellToday : ""}`}
                    >
                      <div className={styles.weekCellInner}>
                        {cellEvents.map((ev) => (
                          <div
                            key={ev.id}
                            className={`${styles.block} ${ev.colorClass}`}
                          >
                            <div className={styles.blockTitle}>{ev.title}</div>
                            {(ev.room || ev.teacher) && (
                              <div className={styles.blockMeta}>
                                {ev.room && `Phòng ${ev.room}`}
                                {ev.room && ev.teacher ? " • " : ""}
                                {ev.teacher}
                              </div>
                            )}
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
        {currentTimeTop != null && (
          <div
            className={styles.currentTimeLine}
            style={currentTimeLineStyle}
            aria-hidden
          >
            <span className={styles.currentTimeDot} />
            <span className={styles.currentTimeRule} />
          </div>
        )}
      </div>
    </div>
  );
});
