"use client";

import { PlayIcon } from "@/icon";
import type { Lesson } from "../types";
import styles from "../courses.module.scss";

function formatDuration(mins: number): string {
  const m = Math.floor(mins);
  const s = Math.round((mins - m) * 60);
  return `${m}:${s.toString().padStart(2, "0")} phút`;
}

interface LessonItemProps {
  lesson: Lesson;
  onPlay?: (lesson: Lesson) => void;
  isActive?: boolean;
}

export function LessonItem({ lesson, onPlay, isActive: isActiveProp }: LessonItemProps) {
  const isActive = isActiveProp === true;

  return (
    <div
      className={`${styles.lessonRow} ${isActive ? styles.lessonRowActive : styles.lessonRowDefault}`}
    >
      <div
        className={`${styles.lessonIconBox} ${isActive ? styles.lessonIconBoxActive : styles.lessonIconBoxDefault}`}
      >
        {isActive ? (
          <span className={styles.lessonDots}>
            <span className={styles.lessonDot} />
            <span className={styles.lessonDot} />
            <span className={styles.lessonDot} />
          </span>
        ) : (
          <PlayIcon className={styles.lessonPlayIcon} />
        )}
      </div>
      <div className={styles.lessonBody}>
        <p className={styles.lessonDuration}>
          {formatDuration(lesson.durationMins)}
        </p>
        <h4
          className={`${styles.lessonTitle} ${isActive ? styles.lessonTitleActive : styles.lessonTitleDefault}`}
        >
          {lesson.title}
        </h4>
        {lesson.description && (
          <p className={styles.lessonDesc}>{lesson.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onPlay?.(lesson)}
        aria-label={`Phát ${lesson.title}`}
        className={styles.lessonPlayBtn}
      >
        <PlayIcon className={styles.lessonPlayIcon} />
      </button>
    </div>
  );
}
