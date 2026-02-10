import { api } from "@/service/api";

export interface ExamResponse {
    success: boolean;
    message?: string;
    data: ExamData[];
}

export interface ExamData {
    exam_id: number;
    exam_name: string;
    class_id: number;
    class_name: string;
    subject_name: string;
    open_datetime: string;
    close_datetime: string;
    classroom_id: number;
    exam_file_ids: number [];
    exam_files: ExamFileData[];
    submitted: boolean;
    submit_id: number | null;
    score: number | null;
    comment: string | null;
}

export interface ExamFileData {
    id: number;
    name: string;
    url: string;
}

export type GetExamParams = Record<string, string>;

export interface SubmitExamResponse {
    success: boolean;
    message?: string;
    data: SubmitExamData;
}

export interface SubmitExamData {
    id: number;
    score: number;
    comment: string;
}

export const getExam = async (
    params?: GetExamParams
): Promise<ExamResponse | { success: false; status?: number }> => {
    try {
        const response = await api.get<ExamResponse | ExamData[]>('/class/exams', params);
        return response as ExamResponse;
    } catch (error: unknown) {
        const status = (error as { status?: number })?.status;
        return { success: false, status };
    }
};

export type SubmitExamError = { success: false; status?: number; message?: string };

export const submitExam = async (examId: number, files: File[]): Promise<SubmitExamResponse | SubmitExamError> => {
    try {
        const formData = new FormData();
        formData.append("exam_id", String(examId));
        files.forEach((file) => formData.append("files", file));
        const response = await api.postFormData<SubmitExamResponse | SubmitExamData>("/class/exams/submit", formData);
        if (response && typeof response === "object" && "id" in response) {
            return { success: true, data: response as SubmitExamData };
        }
        return response as SubmitExamResponse;
    } catch (error: unknown) {
        const status = (error as { status?: number })?.status;
        return { success: false, status };
    }
};