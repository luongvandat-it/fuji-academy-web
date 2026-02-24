"use client";

import { AssignmentCard } from "./AssignmentCard";
import type { Assignment } from "../types";
import styles from "../homework.module.scss";

interface AssignmentsListProps {
  assignments: Assignment[];
  onSubmit?: (id: string) => void;
  onDoAssignment?: (id: string) => void;
  onViewSubmission?: (id: string) => void;
}

export function AssignmentsList({
  assignments,
  onSubmit,
  onDoAssignment,
  onViewSubmission,
}: AssignmentsListProps) {
  if (assignments.length === 0) {
    return (
      <div className={styles.listScroll}>
        <p className={styles.cardMeta}>Chưa có bài tập nào.</p>
      </div>
    );
  }

  return (
    <div className={styles.listScroll}>
      <ul className={styles.list} role="list">
        {assignments.map((a) => (
          <li key={a.id}>
            <AssignmentCard
              assignment={a}
              onSubmit={onSubmit}
              onDoAssignment={onDoAssignment}
              onViewSubmission={onViewSubmission}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
