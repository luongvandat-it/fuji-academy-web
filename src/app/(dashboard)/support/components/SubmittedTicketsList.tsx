"use client";

import { Text } from "@/components/ui";
import { ClockIcon } from "@/icon";
import type { SupportTicketData } from "@/service/modules/support/logic";
import { TicketCard } from "./TicketCard";
import styles from "../support.module.scss";

export interface SubmittedTicketsListProps {
  tickets: SupportTicketData[];
  onViewAll?: () => void;
}

export function SubmittedTicketsList({ tickets, onViewAll }: SubmittedTicketsListProps) {
  return (
    <div className={styles.ticketsListCard}>
      <div className={styles.ticketsListHeader}>
        <div className={styles.ticketsListHeaderLeft}>
          <ClockIcon className={styles.ticketsListIcon} aria-hidden />
          <Text variant="HEADING.TWO" as="h2" className={styles.ticketsListTitle}>
            Yêu cầu đã gửi
          </Text>
        </div>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className={styles.viewAllLink}
          >
            Xem tất cả
          </button>
        )}
      </div>

      {tickets.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>💬</div>
          <Text variant="BODY.MEDIUM" as="p" className={styles.emptyStateText}>
            Đội ngũ hỗ trợ luôn sẵn sàng
          </Text>
        </div>
      ) : (
        <div className={styles.ticketsList}>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
