"use client";

import { useState } from "react";
import { CourseListPanel } from "./components";
import { MOCK_COURSES } from "./mockData";
import type { CourseTabId } from "./types";
import styles from "./courses.module.scss";

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<CourseTabId>("all");

  return (
    <div className={styles.pageLayoutFull}>
      <CourseListPanel
        courses={MOCK_COURSES}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
