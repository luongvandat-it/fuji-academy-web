"use client";

import { Loading } from "@/components/ui";
import { getSchedule, ScheduleData } from "@/service/modules/schedule/logic";
import { useEffect, useState } from "react";
import styles from "./placeholder.module.scss";

export default function Home() {
  const [schedule, setSchedule] = useState<ScheduleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSchedule = async () => {
    const response = await getSchedule();
    if (response?.success) setSchedule(response.data);
  };

  useEffect(() => {
    let mounted = true;
    loadSchedule().finally(() => {
      if (mounted) setIsLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Trang chủ</h1>
        <div className={styles.loadingCard}>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Trang chủ</h1>
      <div className={styles.card}>
        <p className={styles.cardText}>Sắp ra mắt...</p>
      </div>
    </div>
  );
}
