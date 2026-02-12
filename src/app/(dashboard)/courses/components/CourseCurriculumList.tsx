"use client";

import { ChevronDownIcon, ChevronLeftIcon, LessonCompletedIcon, LessonNotCompletedIcon } from "@/icon";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Course, Lesson } from "../types";
import type { LessonType } from "../types";
import styles from "../courses.module.scss";

function formatDuration(mins: number): string {
  const m = Math.floor(mins);
  const s = Math.round((mins - m) * 60);
  return `${m}:${s.toString().padStart(2, "0")} phút`;
}

function getLessonTypeLabel(type?: LessonType): string {
  switch (type) {
    case "video":
      return "Video";
    case "text":
      return "Reading";
    case "quiz":
      return "Bài kiểm tra";
    default:
      return "Video";
  }
}

interface CourseCurriculumListProps {
  course: Course;
  courses: Course[];
  selectedLessonId?: string | null;
  completedLessonIds?: string[];
  onSelectCourse: (course: Course) => void;
  onSelectLesson?: (lesson: Lesson) => void;
  onBackFromCurriculum?: () => void;
}

export function CourseCurriculumList({
  course,
  courses,
  selectedLessonId,
  completedLessonIds = [],
  onSelectCourse,
  onSelectLesson,
  onBackFromCurriculum,
}: CourseCurriculumListProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const [openModuleIds, setOpenModuleIds] = useState<Set<string>>(() => {
    const ids = course.modules?.map((m) => m.id) ?? [];
    return new Set(ids);
  });

  useEffect(() => {
    const ids = course.modules?.map((m) => m.id) ?? [];
    setOpenModuleIds(new Set(ids));
  }, [course.id]);

  const modules = course.modules?.length
    ? course.modules
    : [{ id: "default", title: "Nội dung khóa học", lessons: course.lessons }];

  const toggleModule = useCallback((id: string) => {
    setOpenModuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleDropdownToggle = useCallback(() => {
    setDropdownOpen((o) => !o);
  }, []);

  const handleSelectCourse = useCallback(
    (c: Course) => {
      onSelectCourse(c);
      setDropdownOpen(false);
    },
    [onSelectCourse]
  );

  return (
    <div className={styles.curriculumRoot}>
      {onBackFromCurriculum && (
        <div className={styles.curriculumBackWrap}>
          <button
            type="button"
            onClick={onBackFromCurriculum}
            className={styles.curriculumBackBtn}
            aria-label="Trở lại danh sách khóa học"
          >
            <ChevronLeftIcon className={styles.curriculumBackIcon} />
            <span>Trở lại</span>
          </button>
        </div>
      )}
      <div className={styles.curriculumHeader}>
        <h2 className={styles.curriculumTitle}>{course.title}</h2>
        <div className={styles.curriculumDropdownWrap} ref={dropdownRef}>
          <button
            type="button"
            onClick={handleDropdownToggle}
            aria-label="Chọn khóa học khác"
            aria-expanded={dropdownOpen}
            className={styles.curriculumDropdownTrigger}
          >
            <ChevronDownIcon
              className={`${styles.curriculumDropdownChevron} ${dropdownOpen ? styles.curriculumDropdownChevronOpen : ""}`}
            />
          </button>
          {dropdownOpen && (
            <div className={styles.curriculumDropdown} role="listbox">
              {courses.map((c) => {
                const isCurrent = c.id === course.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="option"
                    aria-selected={isCurrent}
                    onClick={() => handleSelectCourse(c)}
                    className={`${styles.curriculumDropdownItem} ${isCurrent ? styles.curriculumDropdownItemCurrent : ""}`}
                  >
                    {c.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className={styles.curriculumScroll}>
        {modules.map((mod, index) => {
          const isOpen = openModuleIds.has(mod.id);
          return (
            <div key={mod.id} className={styles.curriculumModule}>
              <button
                type="button"
                onClick={() => toggleModule(mod.id)}
                className={styles.curriculumModuleHeader}
                aria-expanded={isOpen}
              >
                <span className={styles.curriculumModuleTitle}>
                  Module {index + 1}: {mod.title}
                </span>
                <span
                  className={`${styles.curriculumChevron} ${isOpen ? styles.curriculumChevronOpen : ""}`}
                >
                  <ChevronDownIcon />
                </span>
              </button>
              <div
                className={`${styles.curriculumModuleContent} ${isOpen ? styles.curriculumModuleContentOpen : ""}`}
                aria-hidden={!isOpen}
              >
                <ul className={styles.curriculumLessonList}>
                  {mod.lessons.map((lesson) => {
                    const isActive = selectedLessonId === lesson.id;
                    const isCompleted = completedLessonIds.includes(lesson.id);
                    const typeLabel = getLessonTypeLabel(lesson.type);
                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => onSelectLesson?.(lesson)}
                          className={`${styles.curriculumLessonItem} ${isActive ? styles.curriculumLessonItemActive : ""}`}
                        >
                          <span className={styles.curriculumLessonIcon} aria-hidden>
                            {isCompleted ? (
                              <LessonCompletedIcon className={styles.curriculumLessonIconCompleted} />
                            ) : (
                              <LessonNotCompletedIcon className={styles.curriculumLessonIconNotCompleted} />
                            )}
                          </span>
                          <span className={styles.curriculumLessonContent}>
                            <span className={styles.curriculumLessonTitle}>
                              {lesson.title}
                            </span>
                            <span className={styles.curriculumLessonMeta}>
                              {typeLabel} • {formatDuration(lesson.durationMins)}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
