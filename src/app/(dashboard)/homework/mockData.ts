import type { Assignment } from "./types";

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "1",
    category: "Tiếng Anh cho phát triển nghề nghiệp",
    title: "Bài luận: Kế hoạch nghề nghiệp 5 năm",
    description: "Viết bài luận tối thiểu 500 từ về định hướng bản thân.",
    status: "pending_due",
    dueDate: "2025-02-26T23:59:59.000Z",
    dueInDays: 2,
  },
  {
    id: "2",
    category: "Thiết kế UI/UX với Figma",
    title: "Project 1: Thiết kế Landing Page",
    status: "graded",
    submittedAt: "2023-10-10T00:00:00.000Z",
    score: 9.5,
    maxScore: 10,
    feedback: "Rất tốt.",
  },
  {
    id: "3",
    category: "Lập trình Python",
    title: "Bài tập tuần 3: Cấu trúc dữ liệu List & Dict",
    status: "submitted",
    submittedAt: "2023-10-14T22:15:00.000Z",
  },
  {
    id: "4",
    category: "Digital Marketing cơ bản",
    title: "Phân tích chiến dịch Social Media",
    description: "Phân tích một case study về thương hiệu F&B.",
    status: "pending_due",
    dueDate: "2025-03-01T23:59:59.000Z",
    dueInDays: 5,
  },
];
