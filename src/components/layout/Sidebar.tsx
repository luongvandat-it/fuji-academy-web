"use client";

import {
  BookIcon,
  CalendarIcon,
  ClassIcon,
  CloseIcon,
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
  { href: "/", label: "Dashboard", icon: GridIcon },
  { href: "/schedule", label: "Schedule", icon: CalendarIcon },
  { href: "/homework", label: "Homework", icon: BookIcon },
  { href: "/class", label: "Class", icon: ClassIcon },
  { href: "/report", label: "Report", icon: ReportIcon },
  { href: "/tuition", label: "Tuition", icon: TuitionIcon },
] as const;

const bottomItems = [
  { href: "/settings", label: "Settings", icon: SettingsIcon },
  { href: "/support", label: "Support", icon: SupportIcon },
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
        {onClose && (
          <div className={styles.closeBar}>
            <button
              type="button"
              onClick={onClose}
              className={styles.closeBtn}
              aria-label="close menu"
            >
              <CloseIcon />
            </button>
          </div>
        )}
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
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`${styles.link} ${isActive ? styles.linkActive : ""}`}
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
