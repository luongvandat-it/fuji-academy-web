"use client";

import { Button, Text } from "@/components/ui";
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
  startHours?: number; 
  endHours?: number; 
  rowHour?: number; 
  rowHeight?: number; 
  column?: number; 
  totalColumns?: number; 
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
  startHours,
  endHours,
  rowHour,
  rowHeight = 56,
  column,
  totalColumns,
}: WeekGridEventBlockProps) {
  const timeLabel = `${startTime} - ${endTime}`;
  const blockVariant =
    isPast && attended === true
      ? styles.blockAttended
      : isPast && attended === false
        ? styles.blockNotAttended
        : colorClass;
  const showStatus = isPast === true && attended !== undefined;
  const isClickable = !!onClick && !isPast;

  let blockStyle: React.CSSProperties = {};
  if (startHours != null && endHours != null && rowHour != null) {
    const rowStartHour = rowHour;
    
    const eventStartsInRow = startHours >= rowStartHour && startHours < rowStartHour + 1;
    
    if (eventStartsInRow) {
      const topOffset = (startHours - rowStartHour) * rowHeight;
      
      const totalHeight = (endHours - startHours) * rowHeight;
      
      let width = 'calc(100% - 0.5rem)';
      let left = '0.25rem';
      
      if (totalColumns != null && totalColumns > 1 && column != null) {
        const basePadding = 0.15; 
        const baseGap = 0.08; 
        
        const paddingPercent = Math.max(0.05, basePadding - (totalColumns - 2) * 0.015);
        const gapPercent = Math.max(0.03, baseGap - (totalColumns - 2) * 0.01);
        
        const totalGap = gapPercent * (totalColumns - 1);
        let columnWidthPercent = (100 - paddingPercent * 2 - totalGap) / totalColumns;
        
        if (columnWidthPercent < 18) {
          columnWidthPercent = 18;
          const newTotalGap = 100 - paddingPercent * 2 - columnWidthPercent * totalColumns;
          const newGapPercent = Math.max(0.02, newTotalGap / (totalColumns - 1));
          const leftOffsetPercent = paddingPercent + column * (columnWidthPercent + newGapPercent);
          width = `${columnWidthPercent}%`;
          left = `${leftOffsetPercent}%`;
        } else {
          const leftOffsetPercent = paddingPercent + column * (columnWidthPercent + gapPercent);
          width = `${columnWidthPercent}%`;
          left = `${leftOffsetPercent}%`;
        }
      }
      
      blockStyle.position = 'absolute';
      blockStyle.top = `${topOffset}px`;
      blockStyle.height = 'auto';
      blockStyle.minHeight = `${totalHeight}px`;
      blockStyle.width = width;
      blockStyle.left = left;
      blockStyle.zIndex = column != null ? column + 1 : 1; 
      blockStyle.boxSizing = 'border-box';
      blockStyle.overflow = 'visible'; 
      blockStyle.minWidth = '90px'; 
      blockStyle.maxWidth = '100%'; 
    }
  }

  const isNarrow = totalColumns != null && totalColumns > 2;
  const isVeryNarrow = totalColumns != null && totalColumns > 3;
  
  const showFullInfo = !isVeryNarrow;

  const content = (
    <>
      <div className={styles.blockText}>
        <Text variant="BODY.SMALL" as="span" className={styles.weekBlockTime} title={timeLabel}>
          {timeLabel}
        </Text>
        <Text variant="BODY.MEDIUM" as="span" className={styles.blockTitle} title={title}>
          {title}
        </Text>
        {showFullInfo && (room || teacher) && (
          <Text variant="BODY.SMALL" as="div" className={styles.blockMeta} title={room && teacher ? `Phòng ${room} • ${teacher}` : room ? `Phòng ${room}` : teacher || ''}>
            {room && `Phòng ${room}`}
            {room && teacher ? " • " : ""}
            {teacher}
          </Text>
        )}
        {!showFullInfo && (room || teacher) && (
          <Text variant="BODY.SMALL" as="div" className={styles.blockMeta} title={room && teacher ? `Phòng ${room} • ${teacher}` : room ? `Phòng ${room}` : teacher || ''}>
            {room ? `P.${room}` : ''}
            {room && teacher ? " • " : ""}
            {teacher ? teacher.split(' ').pop() : ''}
          </Text>
        )}
      </div>
      {showStatus &&
        (attended ? (
          <CheckMarkIcon className={styles.blockCheckIcon} />
        ) : (
          <Text variant="CAPTION" as="span" className={styles.blockXIconWrap} aria-hidden>
            <CloseIcon className={styles.blockXIcon} />
          </Text>
        ))}
    </>
  );

  const className = `${styles.block} ${blockVariant} ${isClickable ? styles.blockClickable : ""} ${showStatus ? styles.blockWithStatus : ""}`;

  if (onClick) {
    return (
      <Button
        type="button"
        variant="secondary"
        className={className}
        style={blockStyle}
        onClick={isClickable ? onClick : undefined}
        data-event-id={id}
        disabled={!isClickable}
      >
        {content}
      </Button>
    );
  }

  return <div className={className} style={blockStyle}>{content}</div>;
});

WeekGridEventBlock.displayName = "WeekGridEventBlock";
