import { api } from "@/service/api";
import type {
  TuitionDebtResponse,
  TuitionDebtData,
  TuitionDebtItemData,
} from "./types";

export type {
  TuitionDebtResponse,
  TuitionDebtData,
  TuitionDebtItemData,
};
export const getTuitionDebts = async (): Promise<TuitionDebtResponse | { success: false; status?: number }> => {
    try {
        const response = await api.get<{ success: boolean; code?: number; message?: string; data?: TuitionDebtData }>("/tuition-debts");
        
        if (response && typeof response === "object" && response.success === true && response.data) {
            return {
                success: true,
                message: response.message,
                data: response.data,
            };
        }
        
        return { success: false, status: response?.code };
    } catch (error: unknown) {
        const status = (error as { status?: number })?.status;
        return { success: false, status };
    }
};