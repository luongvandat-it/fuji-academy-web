"use client";

import { Text } from "@/components/ui";
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
      <div className={styles.debtCardBody}>
        <Text variant="HEADING.THREE" as="h3" id={titleId} className={styles.debtName}>
          {item.name}
        </Text>
        <div className={styles.debtMeta}>
          {item.class_name && (
            <Text variant="BODY.SMALL" as="span">
              {item.class_name}
            </Text>
          )}
          <Text variant="BODY.SMALL" as="span">
            {item.debt_type || item.debt_type_code}
          </Text>
          {showDueDate && (
            <Text variant="BODY.SMALL" as="span">
              Hạn {formatDate(item.due_date)}
            </Text>
          )}
          {item.paid_date != null && item.paid_date !== "" && (
            <Text variant="BODY.SMALL" as="span">
              Đã thanh toán {formatDate(item.paid_date)}
            </Text>
          )}
        </div>
        <div className={styles.debtAmounts}>
          {showRemaining && (
            <Text variant="BODY.MEDIUM" as="span" className={styles.debtRemaining}>
              {formatAmount(item.amount_remaining, item.currency_symbol)} còn lại
            </Text>
          )}
        </div>
      </div>
      <Text variant="BUTTON_LABEL.SMALL" as="span" className={`${styles.debtBadge} ${getDebtBadgeClass(item.status)}`}>
        {item.status_label || item.status || "Chờ thanh toán"}
      </Text>
    </article>
  );
}
