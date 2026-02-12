"use client";

import { MenuIcon } from "@/icon";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { isAuthenticated } from "@/service/modules/login/logic";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";
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
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className={styles.menuBtnFloat}
        aria-label="Mở menu"
      >
        <MenuIcon />
      </button>
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
