"use client";

import {
  BookIcon,
  CalendarIcon,
  GridIcon,
  ReportIcon,
  SettingsIcon,
  SupportIcon,
  TuitionIcon,
} from "@/icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Sidebar.module.scss";

const navItems = [
  { href: "/", label: "Trang chủ", icon: GridIcon, main: true },
  { href: "/schedule", label: "Lịch", icon: CalendarIcon, main: true },
  { href: "/homework", label: "Bài tập", icon: BookIcon, main: false },
  // { href: "/class", label: "Lớp học", icon: ClassIcon, main: true },
  { href: "/report", label: "Báo cáo", icon: ReportIcon, main: false },
  { href: "/tuition", label: "Học phí", icon: TuitionIcon, main: true },
] as const;

const bottomItems = [
  { href: "/settings", label: "Cài đặt", icon: SettingsIcon },
  { href: "/support", label: "Hỗ trợ", icon: SupportIcon },
] as const;

export interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [userData, setUserData] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    const user = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    setUserData(user ? JSON.parse(user) : null);
  }, []);

  return (
    <aside
      className={`${styles.aside} ${open ? styles.asideOpen : styles.asideClosed}`}
    >
      <div className={styles.inner}>
        <div className={styles.userSection}>
          <div className={styles.userRow}>
            <div className={styles.avatar} />
            <div className={styles.userInfo}>
              <p className={styles.userName}>{userData?.name}</p>
              <p className={styles.userLevel}>{userData?.email}</p>
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map(({ href, label, icon: Icon, main }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`${styles.link} ${main ? styles.linkMain : ""} ${isActive ? styles.linkActive : ""}`}
              >
                <Icon className={isActive ? styles.iconActive : styles.icon} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.bottom}>
          {bottomItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`${styles.bottomLink} ${isActive ? styles.bottomLinkActive : ""}`}
              >
                <Icon className={isActive ? styles.bottomIconActive : styles.bottomIcon} />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
