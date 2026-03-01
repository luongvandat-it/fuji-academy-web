export interface UpcomingInvoice {
  id: string;
  courseName: string;
  period: string;
  invoiceId: string;
  amount: number;
  currencySymbol: string;
  status: "unpaid" | "paid" | "partial";
  installments?: Array<{
    id: string;
    label: string;
    dueDate: string;
    amount: number;
    paid: boolean;
  }>;
}

export interface CenterBankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  qrContent: string;
}

export interface PaymentHistoryItem {
  id: string;
  serviceName: string;
  transactionDate: string;
  amount: number;
  currencySymbol: string;
  status: "paid" | "pending" | "failed";
}
