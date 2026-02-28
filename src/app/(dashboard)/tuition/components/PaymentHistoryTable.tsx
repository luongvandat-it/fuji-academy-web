"use client";

import { Text } from "@/components/ui";
import type { PaymentHistoryItem } from "../types";
import { formatAmount } from "../utils";
import styles from "../tuition.module.scss";

interface PaymentHistoryTableProps {
  items: PaymentHistoryItem[];
}

function formatDateVi(ymd: string): string {
  if (!ymd) return "—";
  return new Date(ymd + "T00:00:00").toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function PaymentHistoryTable({ items }: PaymentHistoryTableProps) {
  return (
    <section
      className={styles.section}
      aria-labelledby="payment-history-title"
    >
      <Text variant="HEADING.TWO" as="h2" id="payment-history-title" className={styles.sectionHeadTitle}>
        Lịch sử thanh toán
      </Text>
      <div className={styles.historyTableWrap}>
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th scope="col">Dịch vụ / Hóa đơn</th>
              <th scope="col">Ngày giao dịch</th>
              <th scope="col">Số tiền</th>
              <th scope="col">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id}>
                <td>
                  <Text variant="BODY.MEDIUM" as="span">
                    {row.serviceName}
                  </Text>
                </td>
                <td>
                  <Text variant="BODY.SMALL" as="span">
                    {formatDateVi(row.transactionDate)}
                  </Text>
                </td>
                <td>
                  <Text variant="BODY.MEDIUM" as="span">
                    {formatAmount(row.amount, row.currencySymbol)}
                  </Text>
                </td>
                <td>
                  <Text
                    variant="BUTTON_LABEL.SMALL"
                    as="span"
                    className={
                      row.status === "paid"
                        ? styles.historyBadgePaid
                        : undefined
                    }
                  >
                    {row.status === "paid" ? "Đã thanh toán" : row.status}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
