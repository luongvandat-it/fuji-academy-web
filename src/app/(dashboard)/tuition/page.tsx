"use client";

import { Loading } from "@/components/ui";
import { TuitionIcon } from "@/icon";
import { getTuitionDebts, type TuitionDebtData } from "@/service/modules/tuition/logic";
import { useEffect, useMemo, useState } from "react";
import { TuitionDebtCard, TuitionSummaryCard } from "./components";
import styles from "./tuition.module.scss";

const defaultTuitionData: TuitionDebtData = { total_debt: 0, debts: [] };

export default function TuitionPage() {
  const [tuitionData, setTuitionData] = useState<TuitionDebtData>(defaultTuitionData);
  const [isLoading, setIsLoading] = useState(true);

  const loadTuitionDebts = async () => {
    const response = await getTuitionDebts();
    if (response?.success) setTuitionData(response.data);
  };

  useEffect(() => {
    let mounted = true;
    loadTuitionDebts().finally(() => {
      if (mounted) setIsLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const { totalDebt, allItems, currencySymbol } = useMemo(() => {
    const list = tuitionData?.debts ?? [];
    return {
      totalDebt: tuitionData?.total_debt ?? 0,
      allItems: list,
      currencySymbol: list[0]?.currency_symbol ?? "",
    };
  }, [tuitionData]);

  if (isLoading) {
    return (
      <article className={styles.page} aria-labelledby="tuition-page-title">
        <header className={styles.header}>
          <h1 id="tuition-page-title" className={styles.title}>
            Học phí
          </h1>
          <TuitionIcon className={styles.headerIcon} aria-hidden />
        </header>
        <div className={styles.loading}>
          <Loading />
        </div>
      </article>
    );
  }

  return (
    <article className={styles.page} aria-labelledby="tuition-page-title">
      <header className={styles.header}>
        <h1 id="tuition-page-title" className={styles.title}>
          Học phí
        </h1>
        <TuitionIcon className={styles.headerIcon} aria-hidden />
      </header>

      <TuitionSummaryCard totalDebt={totalDebt} currencySymbol={currencySymbol} />

      <section
        className={styles.section}
        aria-labelledby="debts-section-title"
        aria-label="Danh sách công nợ học phí"
      >
        <h2 id="debts-section-title" className={styles.sectionTitle}>
          Công nợ
        </h2>
        {allItems.length === 0 ? (
          <div className={styles.empty} role="status">
            <p className={styles.emptyTitle}>Không có công nợ học phí</p>
            <p>Công nợ học phí của bạn sẽ hiển thị tại đây.</p>
          </div>
        ) : (
          <ul className={styles.debtList} aria-label="Danh sách công nợ học phí">
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
