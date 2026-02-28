import type { BarChartItem, RecentActivityItem, CourseProgressItem } from "./types";

export const MOCK_COURSE_COMPLETION = {
  percent: 72,
  change: 5,
};

export const MOCK_AVERAGE_SCORE = { value: 8.5, max: 10 };

export const MOCK_SESSION_PARTICIPATION: BarChartItem[] = [
  { label: "Khóa TA", value: 85, max: 100 },
  { label: "Khóa Python", value: 60, max: 100 },
  { label: "Khóa Figma", value: 95, max: 100 },
];

export const MOCK_CLASS_PROGRESS: BarChartItem[] = [
  { label: "Lớp TA 01", value: 90, max: 100 },
  { label: "Lớp Python 02", value: 45, max: 100 },
  { label: "Lớp Figma 01", value: 100, max: 100 },
];

export const MOCK_ATTENDANCE_RATE: BarChartItem[] = [
  { label: "Tỉ lệ đi học", value: 88, max: 100 },
];

export const MOCK_AVG_TEST_BY_CLASS: BarChartItem[] = [
  { label: "Lớp TA 01", value: 8.5, max: 10 },
  { label: "Lớp Python 02", value: 7.2, max: 10 },
  { label: "Lớp Figma 01", value: 9.0, max: 10 },
];

export const MOCK_HOMEWORK_RATE: BarChartItem[] = [
  { label: "Tỉ lệ làm bài tập", value: 75, max: 100 },
];

export const MOCK_ON_TIME_STATS: BarChartItem[] = [
  { label: "Đúng giờ tham gia buổi học", value: 95, max: 100 },
];

export const MOCK_RECENT_ACTIVITY: RecentActivityItem[] = [
  { id: "1", type: "watch", title: "Xem video bài học", timeAgo: "2 giờ trước" },
  { id: "2", type: "complete", title: "Hoàn thành bài kiểm tra", timeAgo: "5 giờ trước", score: "9/10" },
  { id: "3", type: "upload", title: "Nộp bài tập về nhà", timeAgo: "1 ngày trước" },
  { id: "4", type: "save", title: "Lưu tài liệu học tập", timeAgo: "2 ngày trước" },
];

export const MOCK_COURSE_PROGRESS: CourseProgressItem[] = [
  { id: "1", courseName: "Tiếng Anh cho phát triển nghề nghiệp", progress: 85, status: "in_progress", lastUpdated: "Hôm nay" },
  { id: "2", courseName: "Thiết kế UI/UX với Figma", progress: 100, status: "completed", lastUpdated: "3 ngày trước" },
  { id: "3", courseName: "Lập trình Python cơ bản", progress: 32, status: "in_progress", lastUpdated: "Hôm qua" },
];
