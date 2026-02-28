"use client";

import { Text } from "@/components/ui";
import styles from "../home.module.scss";

interface StudentInfoProps {
  name: string;
  studentId?: string;
  email?: string;
  className?: string;
  avatar?: string;
}

export function StudentInfo({
  name,
  studentId,
  email,
  className,
  avatar,
}: StudentInfoProps) {
  return (
    <div className={styles.studentInfoCard}>
      <div className={styles.studentInfoHeader}>
        {avatar ? (
          <img src={avatar} alt={name} className={styles.studentAvatar} />
        ) : (
          <div className={styles.studentAvatarPlaceholder}>
            <Text variant="HEADING.TWO" as="span" className={styles.studentAvatarInitial}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </div>
        )}
        <div className={styles.studentInfoDetails}>
          <Text variant="HEADING.TWO" as="h2" className={styles.studentName}>
            {name}
          </Text>
          {studentId && (
            <Text variant="BODY.SMALL" as="p" className={styles.studentId}>
              Mã số: {studentId}
            </Text>
          )}
          {className && (
            <Text variant="BODY.SMALL" as="p" className={styles.studentClass}>
              {className}
            </Text>
          )}
        </div>
      </div>
      {email && (
        <div className={styles.studentInfoFooter}>
          <Text variant="BODY.SMALL" as="p" className={styles.studentEmail}>
            {email}
          </Text>
        </div>
      )}
    </div>
  );
}
