import type { Assignment } from "@/app/(dashboard)/homework/types";
import { MOCK_ASSIGNMENTS } from "@/app/(dashboard)/homework/mockData";

export interface AssignmentsResponse {
  success: boolean;
  message?: string;
  data: Assignment[];
}

export type GetAssignmentsResult =
  | AssignmentsResponse
  | { success: false; status?: number };

/**
 * Lấy danh sách bài tập. Hiện dùng mock; sau có thể gọi API: api.get('/assignment/list').
 */
export const getAssignments = async (): Promise<GetAssignmentsResult> => {
  try {
    return {
      success: true,
      data: MOCK_ASSIGNMENTS,
    };
  } catch (error: unknown) {
    const status = (error as { status?: number })?.status;
    return { success: false, status };
  }
}
