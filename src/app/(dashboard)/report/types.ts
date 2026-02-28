export interface BarChartItem {
  label: string;
  value: number;
  max?: number;
}

export interface RecentActivityItem {
  id: string;
  type: "watch" | "complete" | "upload" | "save";
  title: string;
  timeAgo: string;
  score?: string;
}

export interface CourseProgressItem {
  id: string;
  courseName: string;
  progress: number;
  status: "in_progress" | "completed";
  lastUpdated: string;
}
