"use client";

import type { AssignmentFilterTab } from "../types";
import styles from "../homework.module.scss";

export const FILTER_TABS: { id: AssignmentFilterTab; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Đang chờ" },
  { id: "completed", label: "Hoàn thành" },
];

interface AssignmentsFilterTabsProps {
  activeTab: AssignmentFilterTab;
  onTabChange: (tab: AssignmentFilterTab) => void;
}

export function AssignmentsFilterTabs({
  activeTab,
  onTabChange,
}: AssignmentsFilterTabsProps) {
  return (
    <div className={styles.tabsRoot} role="tablist" aria-label="Lọc bài tập">
      {FILTER_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`${styles.tabBtn} ${
            activeTab === tab.id ? styles.tabBtnActive : styles.tabBtnInactive
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
