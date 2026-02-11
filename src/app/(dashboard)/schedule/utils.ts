import type { ScheduleData, ScheduleItem } from "@/service/modules/schedule/logic";
import type { CalendarEvent } from "./types";

const COLOR_COUNT = 5;

const DAY_OF_WEEK_TO_INDEX: Record<string, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

export function toEvents(
  data: ScheduleData[],
  getColorClass: (index: number) => string
): Array<CalendarEvent & { colorClass: string }> {
  const events: Array<CalendarEvent & { colorClass: string }> = [];
  let colorIndex = 0;
  data.forEach((cls) => {
    (cls.schedules || []).forEach((item: ScheduleItem, idx: number) => {
      const dayKey = (item.day_of_week || "").toLowerCase();
      const dayIndex = DAY_OF_WEEK_TO_INDEX[dayKey];
      if (dayIndex === undefined) return;
      const ci = colorIndex % COLOR_COUNT;
      colorIndex++;
      events.push({
        id: `${cls.class_id}-${item.schedule_id}-${idx}`,
        title: item.schedule_name || cls.class_name || cls.subject_name,
        room: cls.classroom_name || "",
        teacher: cls.teacher_name || "",
        dayIndex,
        startHour: item.start_hour ?? 9,
        endHour: item.end_hour ?? 10,
        startTime: item.start_time || "09:00",
        endTime: item.end_time || "10:00",
        colorIndex: ci,
        colorClass: getColorClass(ci),
        startDate: cls.start_date || "",
        endDate: cls.end_date || "",
      });
    });
  });
  return events;
}

export function getWeekStart(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

const LOCALE_VI = "vi-VN";

export function formatMonthYear(d: Date): string {
  return d.toLocaleDateString(LOCALE_VI, { month: "long", year: "numeric" });
}

export function formatWeekRange(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6);
  const sameMonth = weekStart.getMonth() === weekEnd.getMonth();
  const sameYear = weekStart.getFullYear() === weekEnd.getFullYear();
  if (sameMonth && sameYear) {
    return `${weekStart.getDate()}-${weekEnd.getDate()} ${weekStart.toLocaleDateString(LOCALE_VI, { month: "long", year: "numeric" })}`;
  }
  return `${weekStart.getDate()} ${weekStart.toLocaleDateString(LOCALE_VI, { month: "short" })} - ${weekEnd.getDate()} ${weekEnd.toLocaleDateString(LOCALE_VI, { month: "short", year: "numeric" })}`;
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function getMonthWeeks(monthDate: Date): Date[][] {
  const y = monthDate.getFullYear();
  const m = monthDate.getMonth();
  const firstDay = new Date(y, m, 1);
  const start = getWeekStart(firstDay);
  const weeks: Date[][] = [];
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(addDays(start, w * 7 + d));
    }
    weeks.push(week);
  }
  return weeks;
}

const dateOnlyCache = new Map<string, Date>();

function parseDateOnly(ymd: string): Date {
  if (!ymd) return new Date(0);
  let d = dateOnlyCache.get(ymd);
  if (!d) {
    d = new Date(ymd + "T00:00:00");
    dateOnlyCache.set(ymd, d);
  }
  return d;
}

export function isDateInRange(date: Date, startDate: string, endDate: string): boolean {
  if (!startDate || !endDate) return true;
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);
  return d >= start && d <= end;
}

export function isRangeOverlap(
  rangeStart: Date,
  rangeEnd: Date,
  startDate: string,
  endDate: string
): boolean {
  if (!startDate || !endDate) return true;
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);
  return rangeStart <= end && rangeEnd >= start;
}

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = d.getMonth();
  const day = d.getDate();
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Nhóm danh sách buổi học theo ngày (date YYYY-MM-DD). */
export function buildSessionsByDate<T extends { date: string }>(
  sessions: T[]
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const s of sessions) {
    const key = s.date;
    const list = map.get(key) ?? [];
    list.push(s);
    map.set(key, list);
  }
  return map;
}

/** Lấy giờ dạng "HH:mm" từ chuỗi datetime (vd "2026-02-11 11:00:00"). */
export function formatTimeFromDatetime(datetime: string): string {
  if (!datetime) return "";
  const match = datetime.match(/(\d{1,2}):(\d{2})/);
  return match ? `${match[1].padStart(2, "0")}:${match[2]}` : "";
}

type EventWithRange = { dayIndex: number; startDate?: string; endDate?: string };

export function buildMonthEventsMap<T extends EventWithRange>(
  events: T[],
  firstDay: Date,
  lastDay: Date
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  const endTime = lastDay.getTime();
  for (let d = new Date(firstDay); d.getTime() <= endTime; d.setDate(d.getDate() + 1)) {
    const key = toDateKey(d);
    const dayIndexForDate = (d.getDay() + 6) % 7;
    const list: T[] = [];
    for (let i = 0; i < events.length; i++) {
      const e = events[i];
      if (
        e.dayIndex === dayIndexForDate &&
        isDateInRange(d, e.startDate ?? "", e.endDate ?? "")
      ) {
        list.push(e);
      }
    }
    if (list.length) map.set(key, list);
  }
  return map;
}

export function buildDayWeekEventsMap<T extends { dayIndex: number; startHour: number; endHour: number }>(
  events: T[]
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    for (let h = e.startHour; h < e.endHour; h++) {
      const key = `${e.dayIndex}-${h}`;
      let list = map.get(key);
      if (!list) {
        list = [];
        map.set(key, list);
      }
      list.push(e);
    }
  }
  return map;
}
