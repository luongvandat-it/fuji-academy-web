import { api } from "@/service/api"

export interface ScheduleResponse {
    success: boolean;
    message?: string;
    data: ScheduleData[];
}

export interface ScheduleData {
    class_id: number;
    class_name: string;
    subject_name: string;
    teacher_name: string;
    classroom_name: string;
    start_date: string;
    end_date: string;
    schedules: ScheduleItem[];
}

export interface ScheduleItem {
    schedule_id: number;
    schedule_name: string;
    day_of_week: string;
    day_of_week_label: string;
    start_hour: number;
    end_hour: number;
    start_time: string;
    end_time: string;
}

export const getSchedule = async (): Promise<ScheduleResponse | undefined> => {
    try {
        const response = await api.get('/class/schedules')
        return response as ScheduleResponse
    } catch (error) {
        throw error;
    }
}