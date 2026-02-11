"use client";

import { Logo, MenuIcon } from "@/icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BottomNav } from "./BottomNav";
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
      <header className={styles.topHeader}>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className={styles.menuBtn}
          aria-label="Mở menu"
        >
          <MenuIcon />
        </button>
        <Link href="/" className={styles.logoLink} aria-label="Trang chủ - Fourier LMS">
          <Logo className={styles.logo} />
          <span className={styles.brandName}>Fourier LMS</span>
        </Link>
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
        {children}
      </main>
    </div>
  );
}
