import { api } from "@/service/api";

export interface TuitionDebtResponse {
    success: boolean;
    message?: string;
    data: TuitionDebtData;
}

export interface TuitionDebtData {
    total_debt: number;
    debts : TuitionDebtItemData[];
}

export interface TuitionDebtItemData {
    id: number;
    name: string;
    debt_type: string;
    debt_type_code: string;
    class_id: number | null;
    class_name: string | null;
    currency_id : number;
    currency_name: string;
    currency_symbol: string;
    amount: number;
    amount_paid: number;
    amount_remaining: number;
    due_date: string;
    status:string;
    status_label: string;
    paid_date: string | null;
    description: string;
}
export const getTuitionDebts = async (): Promise<TuitionDebtResponse | { success: false; status?: number }> => {
    try {
        const response = await api.get<TuitionDebtResponse>("/tuition-debts");
        return response as TuitionDebtResponse;
    } catch (error: unknown) {
        const status = (error as { status?: number })?.status;
        return { success: false, status };
    }
};