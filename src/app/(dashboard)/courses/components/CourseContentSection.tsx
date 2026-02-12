"use client";

import { LessonItem } from "./LessonItem";
import type { Lesson } from "../types";
import styles from "../courses.module.scss";

interface CourseContentSectionProps {
  lessons: Lesson[];
  totalLectures?: number;
  totalHours?: string;
  onPlayLesson?: (lesson: Lesson) => void;
  selectedLessonId?: string | null;
}

export function CourseContentSection({
  lessons,
  totalLectures,
  totalHours,
  onPlayLesson,
  selectedLessonId,
}: CourseContentSectionProps) {
  const lectureCount = totalLectures ?? lessons.length;
  const hoursLabel = totalHours ?? "2 giờ";

  return (
    <section aria-labelledby="course-content-heading">
      <div className={styles.contentSection}>
        <h2
          id="course-content-heading"
          className={styles.contentHeading}
        >
          Nội dung khóa học
        </h2>
        <span className={styles.contentMeta}>
          {lectureCount} bài giảng • {hoursLabel}
        </span>
      </div>
      <ul className={styles.contentList}>
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <LessonItem
              lesson={lesson}
              onPlay={onPlayLesson}
              isActive={lesson.id === selectedLessonId}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
