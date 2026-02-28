"use client";

import { useEffect, useState, useMemo } from "react";
import { Text, Loading } from "@/components/ui";
import { getTuitionDebts, type TuitionDebtItemData } from "@/service/modules/tuition/logic";
import {
  UpcomingPaymentCard,
  UpcomingInvoicesList,
  PaymentHistoryTable,
  PaymentPanel,
  UploadProofSection,
  SupportSection,
} from "./components";
import {
  MOCK_BANK_ACCOUNTS,
} from "./mockData";
import type { UpcomingInvoice, PaymentHistoryItem } from "./types";
import styles from "./tuition.module.scss";

function convertDebtToInvoice(debt: TuitionDebtItemData): UpcomingInvoice {
  const status = debt.status === "paid" ? "paid" : debt.status === "overdue" ? "unpaid" : "unpaid";
  
  return {
    id: String(debt.id),
    courseName: debt.debt_type || debt.debt_type_code,
    period: debt.due_date ? new Date(debt.due_date).toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" }) : "",
    invoiceId: debt.name,
    amount: debt.amount_remaining > 0 ? debt.amount_remaining : debt.amount,
    currencySymbol: debt.currency_symbol,
    status: status as "unpaid" | "paid" | "partial",
  };
}

function convertDebtToHistoryItem(debt: TuitionDebtItemData): PaymentHistoryItem | null {
  if (debt.status !== "paid" || !debt.paid_date) return null;
  
  return {
    id: String(debt.id),
    serviceName: debt.debt_type || debt.debt_type_code,
    transactionDate: debt.paid_date,
    amount: debt.amount_paid,
    currencySymbol: debt.currency_symbol,
    status: "paid",
  };
}

export default function TuitionPage() {
  const [loading, setLoading] = useState(true);
  const [debts, setDebts] = useState<TuitionDebtItemData[]>([]);
  const [totalDebt, setTotalDebt] = useState(0);
  const [currencySymbol, setCurrencySymbol] = useState("₫");

  useEffect(() => {
    const signal = { cancelled: false };
    
    async function loadTuitionDebts() {
      setLoading(true);
      try {
        const result = await getTuitionDebts();
        if (signal.cancelled) return;
        
        if (result.success && "data" in result) {
          setDebts(result.data.debts);
          setTotalDebt(result.data.total_debt);
          if (result.data.debts.length > 0) {
            setCurrencySymbol(result.data.debts[0].currency_symbol || "₫");
          }
        }
      } catch (error) {
        console.error("Failed to load tuition debts:", error);
      } finally {
        if (!signal.cancelled) {
          setLoading(false);
        }
      }
    }
    
    loadTuitionDebts();
    return () => {
      signal.cancelled = true;
    };
  }, []);

  const upcomingInvoices = useMemo(() => {
    return debts
      .filter((debt) => debt.status !== "paid" && debt.amount_remaining > 0)
      .map(convertDebtToInvoice);
  }, [debts]);

  const paymentHistory = useMemo(() => {
    return debts
      .map(convertDebtToHistoryItem)
      .filter((item): item is PaymentHistoryItem => item !== null)
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
  }, [debts]);

  const handlePayAll = () => {
  };

  if (loading) {
    return (
      <article className={styles.page} aria-labelledby="tuition-page-title">
        <header className={styles.header}>
          <div>
            <Text variant="HEADING.ONE" as="h1" id="tuition-page-title" className={styles.title}>
              Học phí & Thanh toán
            </Text>
            <Text variant="BODY.MEDIUM" as="p" className={styles.subtitle}>
              Quản lý hóa đơn, lịch sử thanh toán và phương thức của bạn.
            </Text>
          </div>
        </header>
        <div className={styles.loading}>
          <Loading />
        </div>
      </article>
    );
  }

  return (
    <article className={`${styles.page} tuition-page`} aria-labelledby="tuition-page-title">
      <header className={styles.header}>
        <div>
          <Text variant="HEADING.ONE" as="h1" id="tuition-page-title" className={styles.title}>
            Học phí & Thanh toán
          </Text>
          <Text variant="BODY.MEDIUM" as="p" className={styles.subtitle}>
            Quản lý hóa đơn, lịch sử thanh toán và phương thức của bạn.
          </Text>
        </div>
      </header>

      <div className={styles.contentScroll}>
        <div className={styles.grid}>
        <div className={styles.mainCol}>
          <UpcomingPaymentCard
            totalAmount={totalDebt}
            currencySymbol={currencySymbol}
            dueDate=""
          />
          <UpcomingInvoicesList
            invoices={upcomingInvoices}
            onPayAll={handlePayAll}
          />
          <PaymentHistoryTable items={paymentHistory} />
        </div>
        <aside className={styles.sideCol} aria-label="Thanh toán và hỗ trợ">
          <PaymentPanel accounts={MOCK_BANK_ACCOUNTS} />
          <UploadProofSection />
          <SupportSection />
        </aside>
        </div>
      </div>
    </article>
  );
}
