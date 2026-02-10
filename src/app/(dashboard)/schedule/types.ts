export type ViewMode = "day" | "week" | "month";

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const TIME_SLOTS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22] as const;

export interface CalendarEvent {
  id: string;
  title: string;
  room: string;
  teacher: string;
  dayIndex: number;
  startHour: number;
  endHour: number;
  startTime: string;
  endTime: string;
  colorIndex: number;
  startDate: string;
  endDate: string;
}
