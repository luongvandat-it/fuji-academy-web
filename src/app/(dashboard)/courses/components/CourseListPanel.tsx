"use client";

import { SearchIcon } from "@/icon";
import { CourseCard } from "./CourseCard";
import { CourseTabs } from "./CourseTabs";
import type { Course, CourseTabId } from "../types";
import styles from "../courses.module.scss";

interface CourseListPanelProps {
  courses: Course[];
  activeTab: CourseTabId;
  onTabChange: (tab: CourseTabId) => void;
}

export function CourseListPanel({
  courses,
  activeTab,
  onTabChange,
}: CourseListPanelProps) {
  return (
    <div className={styles.listPanel}>
      <div className={styles.listHeader}>
        <h1 className={styles.listTitle}>Khóa học</h1>
      </div>

      <div className={styles.listToolbar}>
        <div className={styles.searchWrap}>
          <SearchIcon className={styles.searchWrapIcon} aria-hidden />
          <input
            type="search"
            placeholder="Tìm kiếm khóa học..."
            className={styles.searchInput}
            aria-label="Tìm kiếm khóa học"
          />
        </div>
        <CourseTabs activeTab={activeTab} onTabChange={onTabChange} />
      </div>

      <div className={styles.listScroll}>
        <ul className={styles.listGrid} role="list">
          {courses.map((course) => (
            <li key={course.id}>
              <CourseCard course={course} href={`/courses/${course.id}`} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
