"use client";

import { ClassData, getClass } from "@/service/modules/class/logic";
import type { ScheduleData } from "@/service/modules/schedule/logic";
import { getSchedule } from "@/service/modules/schedule/logic";
import { useMemo, useEffect, useState } from "react";
import { ClassCard } from "./components";
import { getClassIdsWithClassToday } from "./utils";
import styles from "./class.module.scss";

export default function ClassPage() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([]);

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
    loadClasses();
    loadSchedule();
  }, []);

  const classIdsWithClassToday = useMemo(
    () => getClassIdsWithClassToday(scheduleData),
    [scheduleData]
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Classes</h1>
      </header>
      <div className={styles.grid}>
        {classes.map((c) => (
          <ClassCard
            key={c.class_id}
            item={c}
            hasClassToday={classIdsWithClassToday.has(c.class_id)}
          />
        ))}
      </div>
    </div>
  );
}
