"use client";

import { CheckMarkIcon, CloseIcon } from "@/icon";
import { memo } from "react";
import styles from "../../schedule.module.scss";

interface WeekGridEventBlockProps {
  id: string;
  title: string;
  room?: string;
  teacher?: string;
  startTime: string;
  endTime: string;
  colorClass: string;
  onClick?: () => void;
  isPast?: boolean;
  attended?: boolean;
}

export const WeekGridEventBlock = memo(function WeekGridEventBlock({
  id,
  title,
  room,
  teacher,
  startTime,
  endTime,
  colorClass,
  onClick,
  isPast,
  attended,
}: WeekGridEventBlockProps) {
  const timeLabel = `${startTime} - ${endTime}`;
  const blockVariant =
    isPast && attended
      ? styles.blockAttended
      : isPast && !attended
        ? styles.blockNotAttended
        : colorClass;
  const showStatus = isPast === true;
  const isClickable = !!onClick && !isPast;

  const content = (
    <>
      <div className={styles.blockText}>
        <span className={styles.weekBlockTime}>{timeLabel}</span>
        <span className={styles.blockTitle}>{title}</span>
        {(room || teacher) && (
          <div className={styles.blockMeta}>
            {room && `Phòng ${room}`}
            {room && teacher ? " • " : ""}
            {teacher}
          </div>
        )}
      </div>
      {showStatus &&
        (attended ? (
          <CheckMarkIcon className={styles.blockCheckIcon} />
        ) : (
          <span className={styles.blockXIconWrap} aria-hidden>
            <CloseIcon className={styles.blockXIcon} />
          </span>
        ))}
    </>
  );

  const className = `${styles.block} ${blockVariant} ${isClickable ? styles.blockClickable : ""} ${showStatus ? styles.blockWithStatus : ""}`;

  if (onClick) {
    return (
      <button
        type="button"
        className={className}
        onClick={isClickable ? onClick : undefined}
        data-event-id={id}
        disabled={!isClickable}
      >
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
});
