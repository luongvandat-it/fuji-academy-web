"use client";

import { TuitionIcon } from "@/icon";
import { getTuitionDebts, type TuitionDebtData } from "@/service/modules/tuition/logic";
import { useEffect, useMemo, useState } from "react";
import { TuitionDebtCard, TuitionSummaryCard } from "./components";
import styles from "./tuition.module.scss";

const defaultTuitionData: TuitionDebtData = { total_debt: 0, debts: [] };

export default function TuitionPage() {
  const [tuitionData, setTuitionData] = useState<TuitionDebtData>(defaultTuitionData);

  const loadTuitionDebts = async () => {
    const response = await getTuitionDebts();
    if (response?.success) setTuitionData(response.data);
  };

  useEffect(() => {
    loadTuitionDebts();
  }, []);

  const { totalDebt, allItems, currencySymbol } = useMemo(() => {
    const list = tuitionData?.debts ?? [];
    return {
      totalDebt: tuitionData?.total_debt ?? 0,
      allItems: list,
      currencySymbol: list[0]?.currency_symbol ?? "",
    };
  }, [tuitionData]);

  return (
    <article className={styles.page} aria-labelledby="tuition-page-title">
      <header className={styles.header}>
        <h1 id="tuition-page-title" className={styles.title}>
          Tuition
        </h1>
        <TuitionIcon className="shrink-0 text-gray-500" aria-hidden />
      </header>

      <TuitionSummaryCard totalDebt={totalDebt} currencySymbol={currencySymbol} />

      <section
        className={styles.section}
        aria-labelledby="debts-section-title"
        aria-label="Tuition debts list"
      >
        <h2 id="debts-section-title" className={styles.sectionTitle}>
          Debts
        </h2>
        {allItems.length === 0 ? (
          <div className={styles.empty} role="status">
            <p className={styles.emptyTitle}>No tuition debts</p>
            <p>Your tuition records will appear here.</p>
          </div>
        ) : (
          <ul className={styles.debtList} aria-label="List of tuition debts">
            {allItems.map((item) => (
              <li key={item.id}>
                <TuitionDebtCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
