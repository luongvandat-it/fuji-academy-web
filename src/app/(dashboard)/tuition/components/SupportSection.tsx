"use client";

import Link from "next/link";
import { Text } from "@/components/ui";
import styles from "../tuition.module.scss";

export function SupportSection() {
  return (
    <section
      className={styles.supportCard}
      aria-labelledby="support-title"
    >
      <Text variant="HEADING.TWO" as="h2" id="support-title" className={styles.sectionHeadTitle}>
        Cần hỗ trợ?
      </Text>
      <Text variant="BODY.SMALL" as="p" className={styles.uploadDesc}>
        Mọi thắc mắc về vấn đề tài chính, vui lòng liên hệ bộ phận hỗ trợ của
        chúng tôi.
      </Text>
      <Link href="/support" className={styles.supportLink}>
        Gửi Ticket hỗ trợ →
      </Link>
    </section>
  );
}
