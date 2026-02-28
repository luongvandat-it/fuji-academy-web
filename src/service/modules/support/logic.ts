import { api } from "@/service/api";
import type {
  SupportTicketResponse,
  SupportTicketData,
  SubmitSupportTicketParams,
  SubmitSupportTicketResponse,
} from "./types";

export type { SupportTicketResponse, SupportTicketData, SubmitSupportTicketParams, SubmitSupportTicketResponse };

export const getSupportTickets = async (): Promise<
  SupportTicketResponse | { success: false; status?: number }
> => {
  try {
    const response = await api.get<{
      success: boolean;
      code?: number;
      message?: string;
      data?: {
        tickets: SupportTicketData[];
        total: number;
        limit: number;
        offset: number;
      };
    }>("/support/tickets");

    if (
      response &&
      typeof response === "object" &&
      response.success === true &&
      response.data &&
      Array.isArray(response.data.tickets)
    ) {
      return {
        success: true,
        code: response.code,
        message: response.message,
        data: {
          tickets: response.data.tickets,
          total: response.data.total ?? response.data.tickets.length,
          limit: response.data.limit ?? 20,
          offset: response.data.offset ?? 0,
        },
      };
    }

    return { success: false, status: response?.code };
  } catch (error: unknown) {
    const status = (error as { status?: number })?.status;
    return { success: false, status };
  }
};

export const submitSupportTicket = async (
  params: SubmitSupportTicketParams
): Promise<SubmitSupportTicketResponse | { success: false; status?: number; message?: string }> => {
  try {
    const response = await api.post<{
      success: boolean;
      code?: number;
      message?: string;
      data?: SupportTicketData;
    }>("/support/tickets", params);

    if (response?.success === true) {
      return {
        success: true,
        message: response.message,
        data: response.data,
      };
    }

    return {
      success: false,
      status: response?.code,
      message: response?.message,
    };
  } catch (error: unknown) {
    const status = (error as { status?: number })?.status;
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message;
    return { success: false, status, message };
  }
};
