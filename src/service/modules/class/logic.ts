import { api } from "@/service/api";
import type {
  ClassResponse,
  ClassData,
  ClassSessionResponse,
  ClassSessionData,
  ClassSessionAttendance,
} from "./types";

export type {
  ClassResponse,
  ClassData,
  ClassSessionResponse,
  ClassSessionData,
  ClassSessionAttendance,
};

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