"use client";

import { Text } from "@/components/ui";
import { UploadCloudIcon } from "@/icon";
import styles from "../tuition.module.scss";

export function UploadProofSection() {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
    }
  };

  return (
    <section
      className={styles.uploadCard}
      aria-labelledby="upload-proof-title"
    >
      <Text variant="HEADING.TWO" as="h2" id="upload-proof-title" className={styles.sectionHeadTitle}>
        Upload bằng chứng thanh toán
      </Text>
      <Text variant="BODY.SMALL" as="p" className={styles.uploadDesc}>
        Mọi thắc mắc về vấn đề tài chính, vui lòng liên hệ bộ phận hỗ trợ của
        chúng tôi.
      </Text>
      <label className={styles.uploadZone}>
        <input
          type="file"
          accept="image/*,.pdf"
          className={styles.uploadInput}
          onChange={handleFile}
          aria-label="Chọn file bằng chứng thanh toán"
        />
        <UploadCloudIcon className={styles.uploadZoneIcon} />
        <Text variant="BODY.MEDIUM" as="span" className={styles.uploadZoneText}>
          Chọn file hoặc kéo thả vào đây
        </Text>
      </label>
    </section>
  );
}
