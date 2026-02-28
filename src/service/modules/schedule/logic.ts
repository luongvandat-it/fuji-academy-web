import { api } from "@/service/api";
import type {
  ScheduleResponse,
  ScheduleData,
  ScheduleItem,
  GetScheduleResult,
} from "./types";

export type {
  ScheduleResponse,
  ScheduleData,
  ScheduleItem,
  GetScheduleResult,
};

export const getSchedule = async (): Promise<GetScheduleResult> => {
    try {
        const response = await api.get('/class/schedules')
        return response as ScheduleResponse
    } catch (error: unknown) {
        const status = (error as { status?: number })?.status;
        return { success: false, status };
    }
}