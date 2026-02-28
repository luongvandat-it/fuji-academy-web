"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { isAuthenticated } from "@/service/modules/login/logic";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";
import { Text } from "../ui";
import styles from "./DashboardShell.module.scss";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className={styles.wrapper}>
      <header className={styles.mobileHeader}>
        <Text variant="BUTTON_LABEL.LARGE" className={styles.mobileHeaderText}>
          Fourier LMS
        </Text>
      </header>
      <button
        type="button"
        aria-label="Đóng menu"
        onClick={closeSidebar}
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : styles.overlayHidden}`}
      />
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      <BottomNav />
      <main className={styles.main}>
        <div className={styles.contentInner}>
          {children}
        </div>
      </main>
    </div>
  );
}
