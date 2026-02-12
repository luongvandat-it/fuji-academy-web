"use client";

import type { CourseTabId } from "../types";
import styles from "../courses.module.scss";

const TABS: { id: CourseTabId; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "active", label: "Đang học" },
  { id: "completed", label: "Hoàn thành" },
];

interface CourseTabsProps {
  activeTab: CourseTabId;
  onTabChange: (tab: CourseTabId) => void;
}

export function CourseTabs({ activeTab, onTabChange }: CourseTabsProps) {
  return (
    <div className={styles.tabsRoot}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : styles.tabBtnInactive}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
