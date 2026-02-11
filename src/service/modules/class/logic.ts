import { api } from "@/service/api";

export interface ClassResponse {
    success: boolean;
    message?: string;
    data: ClassData[];
}

export interface ClassData {
    class_id: number;
    class_name: string;
    subject_name: string;
    subject_id: number;
    teacher_name: string;
    teacher_id: number;
    classroom_name: string;
    classroom_id: number;
    start_date: string;
    end_date: string;
    class_type: string;
    student_count: number;
}

export interface ClassSessionResponse {
    success: boolean;
    code: number;
    message: string;
    data: ClassSessionData[];
}

export interface ClassSessionAttendance {
    attendance_id: number | null;
    has_attendance: boolean;
    is_absent: boolean | null;
    is_present: boolean | null;
}

export interface ClassSessionData {
    session_id: number;
    session_name: string;
    class_id: number;
    class_name: string;
    subject_id: number;
    subject_name: string;
    teacher_id: number;
    teacher_name: string;
    classroom_id: number;
    classroom_name: string;
    date: string;
    start_time: string;
    end_time: string;
    class_type: string;
    status: string;
    status_label: string;
    notes: string;
    attendance: ClassSessionAttendance;
}

export const getClass = async (): Promise<ClassResponse | { success: false; status?: number }> => {
    try {
        const response = await api.get<ClassResponse | ClassData[]>('/classes');
        return response as ClassResponse;
    } catch (error: unknown) {
        const status = (error as { status?: number })?.status;
        return { success: false, status };
    }
};


export const getClassSession = async (): Promise<ClassSessionResponse | { success: false; status?: number }> => {
    try {
        const response = await api.get<ClassSessionResponse>('/class-sessions');
        return response as ClassSessionResponse;
    } catch (error: unknown) {
        const status = (error as { status?: number })?.status;
        return { success: false, status };
    }
}