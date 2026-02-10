"use client";

import { formatAmount } from "../utils";
import styles from "../tuition.module.scss";

interface TuitionSummaryCardProps {
  totalDebt: number;
  currencySymbol: string;
}

export function TuitionSummaryCard({ totalDebt, currencySymbol }: TuitionSummaryCardProps) {
  return (
    <section
      className={styles.summaryCard}
      aria-labelledby="tuition-total-label"
      aria-label="Total tuition debt summary"
    >
      <p id="tuition-total-label" className={styles.summaryLabel}>
        Total debt
      </p>
      <p className={styles.summaryAmount}>
        {currencySymbol ? formatAmount(totalDebt, currencySymbol) : "—"}
      </p>
    </section>
  );
}
