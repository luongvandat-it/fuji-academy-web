/** Trạng thái bài tập: chưa nộp, đã nộp đang chấm, đã chấm xong */
export type AssignmentStatus = "pending_due" | "submitted" | "graded";

/** Tab lọc danh sách */
export type AssignmentFilterTab = "all" | "pending" | "completed";

export interface Assignment {
  id: string;
  /** Tên môn / chủ đề */
  category: string;
  /** Tên bài tập */
  title: string;
  /** Mô tả (khi chưa nộp) */
  description?: string;
  status: AssignmentStatus;
  /** ISO date string, ngày hết hạn */
  dueDate?: string;
  /** Số ngày còn lại đến hạn (dùng cho hiển thị "Hết hạn trong X ngày") */
  dueInDays?: number;
  /** ISO datetime string, thời điểm nộp bài */
  submittedAt?: string;
  /** Điểm (khi đã chấm), ví dụ 9.5 */
  score?: number;
  /** Điểm tối đa (ví dụ 10) */
  maxScore?: number;
  /** Phản hồi từ giảng viên (khi đã chấm) */
  feedback?: string;
}
