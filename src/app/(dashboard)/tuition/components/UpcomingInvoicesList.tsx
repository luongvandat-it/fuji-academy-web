"use client";

import { useState } from "react";
import { Button, Text } from "@/components/ui";
import { DocumentIcon, ChevronDownIcon } from "@/icon";
import { formatAmount } from "../utils";
import type { UpcomingInvoice } from "../types";
import styles from "../tuition.module.scss";

interface UpcomingInvoicesListProps {
  invoices: UpcomingInvoice[];
  onPayAll?: () => void;
}

function formatDateVi(ymd: string): string {
  if (!ymd) return "—";
  return new Date(ymd + "T00:00:00").toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function UpcomingInvoicesList({
  invoices,
  onPayAll,
}: UpcomingInvoicesListProps) {
  return (
    <section
      className={styles.section}
      aria-labelledby="upcoming-invoices-title"
    >
      <div className={styles.sectionHead}>
        <Text variant="HEADING.TWO" as="h2" id="upcoming-invoices-title" className={styles.sectionHeadTitle}>
          Hóa đơn sắp tới
        </Text>
        {invoices.length > 0 && (
          <Button
            type="button"
            variant="primary"
            className={styles.payAllBtn}
            onClick={onPayAll}
            aria-label="Thanh toán tất cả"
          >
            Thanh toán tất cả
          </Button>
        )}
      </div>
      <ul className={styles.invoiceList}>
        {invoices.map((inv) => (
          <li key={inv.id}>
            <InvoiceCard invoice={inv} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function InvoiceCard({ invoice }: { invoice: UpcomingInvoice }) {
  const [open, setOpen] = useState(false);
  const hasMultipleInstallments =
    invoice.installments && invoice.installments.length > 1;

  return (
    <article className={styles.invoiceCard}>
      <div className={styles.invoiceCardTop}>
        <div className={styles.invoiceIconWrap}>
          <DocumentIcon />
        </div>
        <div className={styles.invoiceBody}>
          <Text variant="HEADING.THREE" as="h3" className={styles.invoiceCourseName}>
            {invoice.courseName}
          </Text>
          <Text variant="BODY.SMALL" as="p" className={styles.invoiceMeta}>
            {invoice.period} • ID: {invoice.invoiceId}
          </Text>
          <div className={styles.invoiceRow}>
            <Text variant="BODY.MEDIUM" as="span" className={styles.invoiceAmount}>
              {formatAmount(invoice.amount, invoice.currencySymbol)}
            </Text>
            <Text
              variant="BUTTON_LABEL.SMALL"
              as="span"
              className={
                invoice.status === "unpaid"
                  ? styles.invoiceBadgeUnpaid
                  : styles.invoiceBadgePaid
              }
            >
              {invoice.status === "unpaid" ? "Chưa thanh toán" : "Đã thanh toán"}
            </Text>
          </div>
          {hasMultipleInstallments && (
            <>
              <Button
                type="button"
                variant="secondary"
                className={styles.installmentToggle}
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls={`installments-${invoice.id}`}
              >
                <Text variant="BODY.SMALL" as="span">
                  {invoice.installments!.length} đợt thanh toán
                </Text>
                <ChevronDownIcon
                  className={`${styles.chevronDown} ${open ? styles.chevronDownOpen : ""}`}
                />
              </Button>
              {open && (
                <ul
                  id={`installments-${invoice.id}`}
                  className={styles.installmentList}
                  role="region"
                  aria-label="Các đợt thanh toán"
                >
                  {invoice.installments!.map((ins) => (
                    <li key={ins.id} className={styles.installmentItem}>
                      <Text variant="BODY.SMALL" as="span">
                        {ins.label} • Hạn {formatDateVi(ins.dueDate)}
                      </Text>
                      <Text variant="BODY.MEDIUM" as="span" className={styles.invoiceAmount}>
                        {formatAmount(ins.amount, invoice.currencySymbol)}
                        {ins.paid && " ✓"}
                      </Text>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}
