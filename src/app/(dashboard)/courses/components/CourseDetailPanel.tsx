"use client";

import { StarIcon } from "@/icon";
import { CourseLessonContent } from "./CourseLessonContent";
import { InstructorCard } from "./InstructorCard";
import type { Course, Lesson } from "../types";
import styles from "../courses.module.scss";

const STAR_INDICES = [0, 1, 2, 3, 4] as const;

interface CourseDetailPanelProps {
  course: Course | null;
  selectedLessonId?: string | null;
  onPlayLesson?: (lesson: Lesson) => void;
}

export function CourseDetailPanel({
  course,
  selectedLessonId,
  onPlayLesson,
}: CourseDetailPanelProps) {
  if (!course) {
    return (
      <div className={styles.detailEmpty}>
        <p className={styles.detailEmptyText}>Chọn một khóa học để xem chi tiết</p>
      </div>
    );
  }

  const selectedLesson = selectedLessonId
    ? course.lessons.find((l) => l.id === selectedLessonId)
    : null;

  const currentIndex = selectedLessonId
    ? course.lessons.findIndex((l) => l.id === selectedLessonId)
    : -1;
  const nextLesson =
    currentIndex < course.lessons.length - 1
      ? course.lessons[currentIndex + 1]
      : null;
  const isNextQuiz = nextLesson?.type === "quiz";

  return (
    <div className={styles.detailPanel}>
      <div className={styles.detailScroll}>
        <CourseLessonContent course={course} lesson={selectedLesson ?? null} />

        <div className={styles.detailRatingRow}>
        <span className={styles.detailRating}>
          {STAR_INDICES.map((i) => (
            <StarIcon key={i} filled={i < Math.floor(course.rating)} />
          ))}
          <span className={styles.detailRatingCount}>
            {course.rating} ({course.reviewCount})
          </span>
        </span>
        <span className={styles.detailLevel}>{course.level}</span>
      </div>

      <h2 className={styles.detailTitle}>{course.title}</h2>
      <p className={styles.detailDesc}>{course.description}</p>

      <div className={styles.detailInstructorWrap}>
        <InstructorCard
          name={course.instructor.name}
          title={course.instructor.title}
          avatarUrl={course.instructor.avatarUrl}
        />
      </div>
      </div>

      {course.lessons.length > 0 && nextLesson && (
        <div className={styles.detailNextBtnWrap}>
          <button
            type="button"
            onClick={() => onPlayLesson?.(nextLesson)}
            className={isNextQuiz ? styles.detailNextBtnQuiz : styles.detailNextBtn}
          >
            {isNextQuiz ? "Làm bài kiểm tra" : "Bài tiếp theo"}
          </button>
        </div>
      )}
    </div>
  );
}
