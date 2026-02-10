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

export const getClass = async (): Promise<ClassResponse | { success: false; status?: number }> => {
    try {
        const response = await api.get<ClassResponse | ClassData[]>('/classes');
        return response as ClassResponse;
    } catch (error: unknown) {
        const status = (error as { status?: number })?.status;
        return { success: false, status };
    }
};
