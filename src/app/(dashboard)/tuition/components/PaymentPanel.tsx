"use client";

import { useState } from "react";
import { Button, Text } from "@/components/ui";
import type { CenterBankAccount } from "../types";
import styles from "../tuition.module.scss";

interface PaymentPanelProps {
  accounts: CenterBankAccount[];
}

function getQrImageUrl(content: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(content)}`;
}

export function PaymentPanel({ accounts }: PaymentPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    accounts[0]?.id ?? null
  );

  const selected = accounts.find((a) => a.id === selectedId);

  const handleDownloadQR = () => {
    if (selected) {
      const qrUrl = getQrImageUrl(selected.qrContent);
      fetch(qrUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `QR-${selected.bankName}-${selected.accountNumber}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Lỗi khi tải mã QR:", error);
        });
    }
  };

  return (
    <section
      id="payment-qr-section"
      className={styles.paymentPanel}
      aria-labelledby="payment-panel-title"
    >
      <Text variant="HEADING.TWO" as="h2" id="payment-panel-title" className={styles.sectionHeadTitle}>
        Thanh toán
      </Text>
      <Text variant="BODY.SMALL" as="p" className={styles.uploadDesc}>
        Chọn số tài khoản để hiển thị mã QR chuyển khoản.
      </Text>
      <ul className={styles.bankList} role="listbox" aria-label="Số tài khoản trung tâm">
        {accounts.map((acc) => (
          <li key={acc.id}>
            <Button
              type="button"
              variant="secondary"
              role="option"
              aria-selected={selectedId === acc.id}
              className={`${styles.bankItem} ${selectedId === acc.id ? styles.bankItemActive : ""}`}
              onClick={() => setSelectedId(acc.id)}
            >
              <Text variant="BUTTON_LABEL.LARGE" as="span" className={styles.bankLogo}>
                {acc.bankName.charAt(0)}
              </Text>
              <div className={styles.bankInfo}>
                <Text variant="BODY.MEDIUM" as="p" className={styles.bankName}>
                  {acc.bankName}
                </Text>
                <Text variant="BODY.SMALL" as="p" className={styles.bankNumber}>
                  {acc.accountNumber} - {acc.accountName}
                </Text>
              </div>
            </Button>
          </li>
        ))}
      </ul>
      {selected && (
        <div className={styles.qrWrap} aria-label="Mã QR thanh toán">
          <img
            src={getQrImageUrl(selected.qrContent)}
            alt={`Mã QR chuyển khoản ${selected.bankName} - ${selected.accountNumber}`}
            className={styles.qrImage}
            width={160}
            height={160}
          />
          <Text variant="BODY.SMALL" as="p" className={styles.qrLabel}>
            {selected.bankName} - {selected.accountNumber}
          </Text>
          <Button
            type="button"
            variant="secondary"
            className={styles.qrDownloadBtn}
            onClick={handleDownloadQR}
            aria-label="Tải về mã QR"
          >
            Tải về mã QR
          </Button>
        </div>
      )}
    </section>
  );
}
