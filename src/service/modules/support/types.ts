export interface SupportTicketResponse {
  success: boolean;
  code?: number;
  message?: string;
  data: {
    tickets: SupportTicketData[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface SupportTicketData {
  id: number;
  name: string;
  subject: string;
  description: string;
  resolution: string | null;
  ticket_type: "academic" | "technical" | "administrative" | "other";
  priority: "0" | "1" | "2" | "3";
  state: "draft" | "open" | "in_progress" | "done" | "closed";
  is_late: boolean;
  class_id: number | null;
  class_name: string | null;
  teacher_id: number | null;
  teacher_name: string | null;
  deadline: string | null;
  create_date: string;
  resolved_date: string | null;
}

export interface SubmitSupportTicketParams {
  subject: string;
  description: string;
  ticket_type: "academic" | "technical" | "administrative" | "other";
  priority: "0" | "1" | "2" | "3";
}

export interface SubmitSupportTicketResponse {
  success: boolean;
  message?: string;
  data?: SupportTicketData;
}
