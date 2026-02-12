"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CourseCurriculumList, CourseDetailPanel } from "../components";
import { getCourseById } from "../mockData";
import { MOCK_COURSES } from "../mockData";
import type { Course, Lesson } from "../types";
import styles from "../courses.module.scss";

const COMPLETED_LESSON_IDS = ["l1", "l2", "l1-1"];

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = typeof params.id === "string" ? params.id : null;
  const course = courseId ? getCourseById(courseId) : null;

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  useEffect(() => {
    if (!course) {
      setSelectedLessonId(null);
      return;
    }
    setSelectedLessonId((prev) => {
      const valid =
        prev && course.lessons.some((l) => l.id === prev) ? prev : null;
      return valid ?? (course.lessons.length > 0 ? course.lessons[0].id : null);
    });
  }, [course?.id]);

  const onSelectLesson = useCallback((lesson: Lesson) => {
    setSelectedLessonId(lesson.id);
  }, []);

  const onPlayLesson = useCallback((lesson: Lesson) => {
    setSelectedLessonId(lesson.id);
  }, []);

  const onBackFromCurriculum = useCallback(() => {
    router.push("/courses");
  }, [router]);

  const onSelectCourse = useCallback(
    (c: Course) => {
      router.push(`/courses/${c.id}`);
    },
    [router]
  );

  if (!courseId || !course) {
    return (
      <div className={styles.detailWrap}>
        <div className={styles.detailEmpty}>
          <p className={styles.detailEmptyText}>Không tìm thấy khóa học.</p>
          <button
            type="button"
            onClick={() => router.push("/courses")}
            className="mt-4 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Trở lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const effectiveLessonId =
    selectedLessonId && course.lessons.some((l) => l.id === selectedLessonId)
      ? selectedLessonId
      : course.lessons.length > 0
        ? course.lessons[0].id
        : null;

  return (
    <div className={styles.pageLayout}>
      <div className={styles.listWrap}>
        <div className={styles.listPanel}>
          <CourseCurriculumList
            course={course}
            courses={MOCK_COURSES}
            selectedLessonId={effectiveLessonId}
            completedLessonIds={COMPLETED_LESSON_IDS}
            onSelectCourse={onSelectCourse}
            onSelectLesson={onSelectLesson}
            onBackFromCurriculum={onBackFromCurriculum}
          />
        </div>
      </div>
      <div className={styles.detailWrap}>
        <CourseDetailPanel
          course={course}
          selectedLessonId={effectiveLessonId}
          onPlayLesson={onPlayLesson}
        />
      </div>
    </div>
  );
}
