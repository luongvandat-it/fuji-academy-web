import type { ScheduleData } from "@/service/modules/schedule/logic";

export const WEEKDAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export function parseYmd(ymd: string): Date {
  return new Date(ymd + "T00:00:00");
}

export function isDateInRange(date: Date, startDate: string, endDate: string): boolean {
  if (!startDate || !endDate) return false;
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const start = parseYmd(startDate);
  const end = parseYmd(endDate);
  return d >= start && d <= end;
}

export function getClassIdsWithClassToday(scheduleData: ScheduleData[]): Set<number> {
  const today = new Date();
  const todayWeekday = WEEKDAY_KEYS[today.getDay()];
  const set = new Set<number>();
  for (const cls of scheduleData) {
    if (!isDateInRange(today, cls.start_date, cls.end_date)) continue;
    const hasSlotToday = (cls.schedules ?? []).some(
      (s) => (s.day_of_week || "").toLowerCase() === todayWeekday
    );
    if (hasSlotToday) set.add(cls.class_id);
  }
  return set;
}
