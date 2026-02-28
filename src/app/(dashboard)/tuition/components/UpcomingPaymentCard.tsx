"use client";

import { Text } from "@/components/ui";
import { formatAmount } from "../utils";
import styles from "../tuition.module.scss";

interface UpcomingPaymentCardProps {
  totalAmount: number;
  currencySymbol: string;
  dueDate: string;
}

export function UpcomingPaymentCard({
  totalAmount,
  currencySymbol,
  dueDate,
}: UpcomingPaymentCardProps) {
  return (
    <section
      className={styles.upcomingPaymentCard}
      aria-labelledby="upcoming-payment-label"
    >
      <Text variant="LABEL.MEDIUM" as="p" id="upcoming-payment-label" className={styles.summaryLabel}>
        Sắp thanh toán
      </Text>
      <Text variant="BODY.LARGE" as="p" className={styles.upcomingPaymentAmount}>
        {formatAmount(totalAmount, currencySymbol)}
      </Text>
    </section>
  );
}
