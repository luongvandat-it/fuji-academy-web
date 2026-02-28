"use client";

import { Text } from "@/components/ui";
import type { SupportTicketData } from "@/service/modules/support/logic";
import styles from "../support.module.scss";

export interface TicketCardProps {
  ticket: SupportTicketData;
}

function formatTimeAgo(dateString: string): string {
  // Parse date string format: "2026-02-28 09:26:21"
  const date = new Date(dateString.replace(" ", "T"));
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffMs < 0) {
    return "Vừa xong";
  } else if (diffHours < 1) {
    return "Vừa xong";
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  } else if (diffDays === 1) {
    const time = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `Hôm qua, ${time}`;
  } else {
    return date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
}

function getStatusLabel(state?: string): string {
  switch (state) {
    case "draft":
      return "ĐANG CHỜ";
    case "open":
      return "MỞ";
    case "in_progress":
      return "ĐANG XỬ LÝ";
    case "done":
      return "ĐÃ GIẢI QUYẾT";
    case "closed":
      return "ĐÃ ĐÓNG";
    default:
      return "MỞ";
  }
}

function getStatusClass(state?: string): string {
  switch (state) {
    case "draft":
      return styles.statusDraft;
    case "open":
      return styles.statusOpen;
    case "in_progress":
      return styles.statusInProgress;
    case "done":
      return styles.statusResolved;
    case "closed":
      return styles.statusClosed;
    default:
      return styles.statusOpen;
  }
}

function getTicketTypeLabel(ticketType?: string): string {
  switch (ticketType) {
    case "academic":
      return "Học tập";
    case "technical":
      return "Kỹ thuật";
    case "administrative":
      return "Hành chính";
    case "other":
      return "Khác";
    default:
      return "Khác";
  }
}

function getPriorityLabel(priority?: string): string {
  switch (priority) {
    case "0":
      return "Thấp";
    case "1":
      return "Trung bình";
    case "2":
      return "Cao";
    case "3":
      return "Khẩn cấp";
    default:
      return "Thấp";
  }
}

function getPriorityClass(priority?: string): string {
  switch (priority) {
    case "0":
      return styles.priorityLow;
    case "1":
      return styles.priorityMedium;
    case "2":
      return styles.priorityHigh;
    case "3":
      return styles.priorityUrgent;
    default:
      return styles.priorityLow;
  }
}

export function TicketCard({ ticket }: TicketCardProps) {
  const ticketId = ticket.name || `#TK-${ticket.id}`;
  const statusLabel = getStatusLabel(ticket.state);
  const statusClass = getStatusClass(ticket.state);
  const displayDate = ticket.resolved_date || ticket.create_date;
  const ticketTypeLabel = getTicketTypeLabel(ticket.ticket_type);
  const priorityLabel = getPriorityLabel(ticket.priority);
  const priorityClass = getPriorityClass(ticket.priority);

  return (
    <article className={styles.ticketCard}>
      <div className={styles.ticketCardHeader}>
        <Text variant="BODY.MEDIUM" as="p" className={styles.ticketId}>
          {ticketId}
        </Text>
        <span className={`${styles.statusBadge} ${statusClass}`}>
          {statusLabel}
        </span>
      </div>
      <Text variant="BODY.MEDIUM" as="h3" className={styles.ticketTitle}>
        {ticket.subject}
      </Text>
      <div className={styles.ticketMeta}>
        <div className={styles.ticketMetaItem}>
          <Text variant="BODY.SMALL" as="span" className={styles.ticketMetaLabel}>
            Loại:
          </Text>
          <span className={`${styles.ticketTypeBadge} ${styles.ticketTypeBadgeBase}`}>
            {ticketTypeLabel}
          </span>
        </div>
        <div className={styles.ticketMetaItem}>
          <Text variant="BODY.SMALL" as="span" className={styles.ticketMetaLabel}>
            Ưu tiên:
          </Text>
          <span className={`${styles.priorityBadge} ${priorityClass}`}>
            {priorityLabel}
          </span>
        </div>
      </div>
      <Text variant="BODY.SMALL" as="p" className={styles.ticketTime}>
        {ticket.resolved_date
          ? `Đã giải quyết: ${formatTimeAgo(ticket.resolved_date)}`
          : `Cập nhật: ${formatTimeAgo(ticket.create_date)}`}
      </Text>
    </article>
  );
}
