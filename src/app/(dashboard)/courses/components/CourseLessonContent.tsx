"use client";

import { CourseQuiz } from "./CourseQuiz";
import { CourseVideo } from "./CourseVideo";
import type { Course, Lesson } from "../types";
import styles from "../courses.module.scss";

interface CourseLessonContentProps {
  course: Course;
  lesson: Lesson | null;
}

export function CourseLessonContent({ course, lesson }: CourseLessonContentProps) {
  const type = lesson?.type ?? "video";

  if (type === "quiz" && lesson) {
    return (
      <div className={styles.detailVideoWrap}>
        <CourseQuiz lesson={lesson} />
      </div>
    );
  }

  if (type === "text" && lesson?.content) {
    return (
      <div className={styles.detailVideoWrap}>
        <div className={styles.detailLessonText}>{lesson.content}</div>
      </div>
    );
  }

  const videoUrl = lesson?.videoUrl ?? course.videoUrl;
  const videoTitle = lesson ? lesson.title : course.title;

  return (
    <div className={styles.detailVideoWrap}>
      <CourseVideo
        videoUrl={videoUrl}
        posterUrl={course.thumbnailUrl}
        title={videoTitle}
      />
    </div>
  );
}
