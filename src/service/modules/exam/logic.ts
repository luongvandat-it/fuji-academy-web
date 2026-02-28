import { api } from "@/service/api";
import type {
  ExamResponse,
  ExamData,
  ExamFileData,
  GetExamParams,
  SubmitExamResponse,
  SubmitExamData,
  SubmitExamError,
} from "./types";

export type {
  ExamResponse,
  ExamData,
  ExamFileData,
  GetExamParams,
  SubmitExamResponse,
  SubmitExamData,
  SubmitExamError,
};

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


export const submitExam = async (
    examId: number, 
    options?: { 
        files?: File[]; 
        answerText?: string;
        suspectedAiUsed?: boolean;
        aiSuspicionDetails?: string;
    }
): Promise<SubmitExamResponse | SubmitExamError> => {
    try {
        const formData = new FormData();
        formData.append("exam_id", String(examId));
        
        if (options?.files && options.files.length > 0) {
            options.files.forEach((file) => formData.append("files", file));
        }
        
        if (options?.answerText) {
            formData.append("answer_text", options.answerText);
        }

        if (options?.suspectedAiUsed !== undefined) {
            formData.append("suspected_ai_used", String(options.suspectedAiUsed));
        }

        if (options?.aiSuspicionDetails) {
            formData.append("ai_suspicion_details", options.aiSuspicionDetails);
        }
        
        const response = await api.postFormData<{ success: boolean; code?: number; message?: string; data?: number | SubmitExamData }>("/class/exams/submit", formData);
        
        if (response && typeof response === "object" && response.success === true) {
            if (typeof response.data === "number") {
                return { 
                    success: true, 
                    data: { 
                        id: response.data, 
                        score: 0, 
                        comment: "" 
                    } as SubmitExamData 
                };
            }
            if (response.data && typeof response.data === "object" && "id" in response.data) {
                return { success: true, data: response.data as SubmitExamData };
            }
            return { 
                success: true, 
                data: { 
                    id: Date.now(), 
                    score: 0, 
                    comment: "" 
                } as SubmitExamData 
            };
        }
        
        return { success: false, status: response?.code, message: response?.message };
    } catch (error: unknown) {
        const status = (error as { status?: number })?.status;
        return { success: false, status };
    }
};

// Deprecated: Use submitExam with options.files instead
export const submitExamWithFiles = async (examId: number, files: File[]): Promise<SubmitExamResponse | SubmitExamError> => {
    return submitExam(examId, { files });
};

// Deprecated: Use submitExam with options.answerText instead
export const submitExamWithText = async (examId: number, answerText: string): Promise<SubmitExamResponse | SubmitExamError> => {
    return submitExam(examId, { answerText });
};