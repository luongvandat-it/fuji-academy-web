"use client";

import { useMemo, useState } from "react";
import {
  AssignmentsFilterTabs,
  AssignmentsSearchBar,
  AssignmentsList,
} from "./components";
import { MOCK_ASSIGNMENTS } from "./mockData";
import type { Assignment, AssignmentFilterTab } from "./types";
import styles from "./homework.module.scss";

function filterByTab(
  list: Assignment[],
  tab: AssignmentFilterTab
): Assignment[] {
  if (tab === "all") return list;
  if (tab === "pending") {
    return list.filter(
      (a) => a.status === "pending_due" || a.status === "submitted"
    );
  }
  return list.filter((a) => a.status === "graded");
}

function filterBySearch(list: Assignment[], q: string): Assignment[] {
  if (!q.trim()) return list;
  const lower = q.trim().toLowerCase();
  return list.filter(
    (a) =>
      a.category.toLowerCase().includes(lower) ||
      a.title.toLowerCase().includes(lower) ||
      (a.description ?? "").toLowerCase().includes(lower)
  );
}

export default function HomeworkPage() {
  const [activeTab, setActiveTab] = useState<AssignmentFilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const assignments = useMemo(() => {
    const byTab = filterByTab(MOCK_ASSIGNMENTS, activeTab);
    return filterBySearch(byTab, searchQuery);
  }, [activeTab, searchQuery]);

  const handleSubmit = (id: string) => {
    console.log("Submit assignment", id);
  };
  const handleDoAssignment = (id: string) => {
    console.log("Do assignment", id);
  };
  const handleViewSubmission = (id: string) => {
    console.log("View submission", id);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Bài tập</h1>
      </header>

      <div className={styles.toolbar}>
        <AssignmentsSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Tìm kiếm bài tập..."
        />
        <AssignmentsFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <AssignmentsList
        assignments={assignments}
        onSubmit={handleSubmit}
        onDoAssignment={handleDoAssignment}
        onViewSubmission={handleViewSubmission}
      />
    </div>
  );
}
