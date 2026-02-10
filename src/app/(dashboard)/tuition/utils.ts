import styles from "./tuition.module.scss";

export function formatDate(ymd: string): string {
  if (!ymd) return "—";
  const d = new Date(ymd + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatAmount(amount: number, symbol: string): string {
  return `${symbol}${Number(amount).toLocaleString()}`;
}

export function getDebtBadgeClass(status: string): string {
  const s = (status || "").toLowerCase();
  if (s.includes("paid") || s === "paid") return styles.debtBadgePaid;
  if (s.includes("overdue") || s === "overdue") return styles.debtBadgeOverdue;
  return styles.debtBadgePending;
}
