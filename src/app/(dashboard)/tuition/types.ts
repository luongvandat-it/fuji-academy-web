export interface UpcomingInvoice {
  id: string;
  courseName: string;
  period: string;
  invoiceId: string;
  amount: number;
  currencySymbol: string;
  status: "unpaid" | "paid" | "partial";
export interface CenterBankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
export interface PaymentHistoryItem {
  id: string;
  serviceName: string;
  transactionDate: string;
  amount: number;
  currencySymbol: string;
  status: "paid" | "pending" | "failed";
}
