"use client";

import styles from "../courses.module.scss";

interface InstructorCardProps {
  name: string;
  title: string;
  avatarUrl?: string;
}

export function InstructorCard({ name, title, avatarUrl }: InstructorCardProps) {
  return (
    <div className={styles.instructorRoot}>
      <div className={styles.instructorAvatar}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className={styles.instructorAvatarImg}
          />
        ) : (
          <div className={styles.instructorInitial}>{name.charAt(0)}</div>
        )}
      </div>
      <div>
        <p className={styles.instructorName}>{name}</p>
        <p className={styles.instructorTitle}>{title}</p>
      </div>
    </div>
  );
}
