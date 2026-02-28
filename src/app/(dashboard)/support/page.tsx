"use client";

import { useEffect, useState } from "react";
import { Text, Loading } from "@/components/ui";
import {
  getSupportTickets,
  type SupportTicketData,
} from "@/service/modules/support/logic";
import { SubmitSupportForm, SubmittedTicketsList } from "./components";
import styles from "./support.module.scss";

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const signal = { cancelled: false };

    async function loadTickets() {
      try {
        setLoading(true);
        const result = await getSupportTickets();
        if (signal.cancelled) return;

        if (result.success && "data" in result && result.data && Array.isArray(result.data.tickets)) {
          setTickets(result.data.tickets);
        } else {
          setTickets([]);
        }
      } catch (error) {
        console.error("Failed to load support tickets:", error);
        if (!signal.cancelled) {
          setTickets([]);
        }
      } finally {
        if (!signal.cancelled) {
          setLoading(false);
        }
      }
    }

    loadTickets();
    return () => {
      signal.cancelled = true;
    };
  }, []);

  const handleSubmitSuccess = async () => {
    try {
      const result = await getSupportTickets();
      if (result.success && "data" in result && result.data && Array.isArray(result.data.tickets)) {
        setTickets(result.data.tickets);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error("Failed to reload support tickets:", error);
      setTickets([]);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <Text variant="HEADING.ONE" as="h1" className={styles.title}>
            Hỗ trợ
          </Text>
        </header>
        <div className={styles.loading}>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Text variant="HEADING.ONE" as="h1" className={styles.title}>
          Hỗ trợ
        </Text>
      </header>

      <div className={styles.contentScroll}>
        <div className={styles.grid}>
          <div className={styles.mainCol}>
            <SubmitSupportForm onSuccess={handleSubmitSuccess} />
          </div>
          <div className={styles.sideCol}>
            <SubmittedTicketsList tickets={Array.isArray(tickets) ? tickets.slice(0, 5) : []} />
          </div>
        </div>
      </div>
    </div>
  );
}