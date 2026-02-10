"use client";

import { MenuIcon } from "@/icon";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import styles from "./DashboardShell.module.scss";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        aria-label="close menu"
        onClick={closeSidebar}
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : styles.overlayHidden}`}
      />
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      <main className={styles.main}>
        <header className={styles.header}>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className={styles.menuBtn}
            aria-label="open menu"
          >
            <MenuIcon />
          </button>
          <span className={styles.menuLabel}>Menu</span>
        </header>
        {children}
      </main>
    </div>
  );
}
