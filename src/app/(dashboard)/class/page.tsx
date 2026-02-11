"use client";

import { Loading } from "@/components/ui";
import { ClassData, getClass } from "@/service/modules/class/logic";
import type { ScheduleData } from "@/service/modules/schedule/logic";
import { getSchedule } from "@/service/modules/schedule/logic";
import Link from "next/link";
import { useMemo, useEffect, useState } from "react";
import { ClassCard } from "./components";
import { getClassIdsWithClassToday } from "./utils";
import styles from "./class.module.scss";

export default function ClassPage() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadClasses = async () => {
    const response = await getClass();
    if (response?.success) {
      setClasses(response.data);
    }
  };

  const loadSchedule = async () => {
    const res = await getSchedule();
    if (res.success && "data" in res) {
      setScheduleData(Array.isArray(res.data) ? res.data : []);
    } else if (Array.isArray(res)) {
      setScheduleData(res);
    }
  };

  useEffect(() => {
    let mounted = true;
    Promise.all([loadClasses(), loadSchedule()]).finally(() => {
      if (mounted) setIsLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const classIdsWithClassToday = useMemo(
    () => getClassIdsWithClassToday(scheduleData),
    [scheduleData]
  );

  if (isLoading) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Classes</h1>
        </header>
        <div className={styles.loading}>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Classes</h1>
      </header>
      <div className={styles.grid}>
        {classes.map((c) => (
          <Link
            key={c.class_id}
            href={`/class/${c.class_id}`}
            className={styles.cardLink}
          >
            <ClassCard
              item={c}
              hasClassToday={classIdsWithClassToday.has(c.class_id)}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
