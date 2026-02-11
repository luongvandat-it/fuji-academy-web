"use client";

import type { TuitionDebtItemData } from "@/service/modules/tuition/logic";
import { formatAmount, formatDate, getDebtBadgeClass } from "../utils";
import styles from "../tuition.module.scss";

interface TuitionDebtCardProps {
  item: TuitionDebtItemData;
}

function isPaid(item: TuitionDebtItemData): boolean {
  const hasPaidDate = item.paid_date != null && item.paid_date !== "";
  const s = (item.status || "").toLowerCase();
  return hasPaidDate || s === "paid" || s.includes("paid");
}

export function TuitionDebtCard({ item }: TuitionDebtCardProps) {
  const paid = isPaid(item);
  const showDueDate = !paid;
  const showRemaining = !paid;
  const titleId = `debt-title-${item.id}`;
  return (
    <article
      className={styles.debtCard}
      aria-labelledby={titleId}
      aria-label={`Công nợ học phí: ${item.name}`}
    >
      <div className="min-w-0 flex-1">
        <h3 id={titleId} className={styles.debtName}>
          {item.name}
        </h3>
        <div className={styles.debtMeta}>
          {item.class_name && <span>{item.class_name}</span>}
          <span>{item.debt_type || item.debt_type_code}</span>
          {showDueDate && <span>Hạn {formatDate(item.due_date)}</span>}
          {item.paid_date != null && item.paid_date !== "" && (
            <span>Đã thanh toán {formatDate(item.paid_date)}</span>
          )}
        </div>
        <div className={styles.debtAmounts}>
          {showRemaining && (
            <span className={styles.debtRemaining}>
              {formatAmount(item.amount_remaining, item.currency_symbol)} còn lại
            </span>
          )}
        </div>
      </div>
      <span className={`${styles.debtBadge} ${getDebtBadgeClass(item.status)}`}>
        {item.status_label || item.status || "Chờ thanh toán"}
      </span>
    </article>
  );
}
