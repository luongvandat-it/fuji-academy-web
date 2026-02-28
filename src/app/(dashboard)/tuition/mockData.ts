import type {
  UpcomingInvoice,
  CenterBankAccount,
} from "./types";

export const MOCK_UPCOMING_INVOICES: UpcomingInvoice[] = [
  {
    id: "inv-1",
    courseName: "Khóa học Tiếng Anh Giao Tiếp",
    period: "Tháng 10/2023",
    invoiceId: "INV-2023-089",
    amount: 750_000,
    currencySymbol: "₫",
    status: "unpaid",
  },
  {
    id: "inv-2",
    courseName: "Lập trình Python Nâng cao",
    period: "Tháng 10/2023",
    invoiceId: "INV-2023-092",
    amount: 500_000,
    currencySymbol: "₫",
    status: "unpaid",
  },
];

export const MOCK_BANK_ACCOUNTS: CenterBankAccount[] = [
  {
    id: "bank-1",
    bankName: "Vietcombank",
    accountNumber: "1234567890",
    accountName: "TRUNG TAM FUJI",
    qrContent: "1234567890|TRUNG TAM FUJI|Vietcombank",
  },
  {
    id: "bank-2",
    bankName: "Techcombank",
    accountNumber: "0987654321",
    accountName: "CONG TY FUJI EDUCATION",
    qrContent: "0987654321|CONG TY FUJI EDUCATION|Techcombank",
  },
];

