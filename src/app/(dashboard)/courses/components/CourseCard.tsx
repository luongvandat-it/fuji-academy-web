"use client";

import Link from "next/link";
import type { Course } from "../types";
import styles from "../courses.module.scss";

interface CourseCardProps {
  course: Course;
  href?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

function cardContent(course: Course) {
  return (
    <>
      <div className={styles.cardImageWrap}>
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt=""
            className={styles.cardImage}
          />
        ) : (
          <div className={styles.cardImagePlaceholder} />
        )}
      </div>
      <div className={styles.cardContent}>
        <p className={styles.cardProvider}>{course.instructor.name}</p>
        <h3 className={styles.cardTitle}>{course.title}</h3>
        <span className={styles.cardType}>{course.level}</span>
      </div>
    </>
  );
}

export function CourseCard({ course, href, isSelected, onClick }: CourseCardProps) {
  const className = `${styles.cardBtn} ${isSelected ? styles.cardBtnSelected : styles.cardBtnDefault}`;

  if (href) {
    return <Link href={href} className={className}>{cardContent(course)}</Link>;
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {cardContent(course)}
    </button>
  );
}
