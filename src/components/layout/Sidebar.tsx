"use client";

import {
  BookIcon,
  CalendarIcon,
  ClassIcon,
  GridIcon,
  LogoutIcon,
  MaterialsIcon,
  MessageIcon,
  ReportIcon,
  TuitionIcon,
} from "@/icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/service/modules/login/logic";
import styles from "./Sidebar.module.scss";
import { Text } from "../ui";

const navItems = [
  { href: "/", label: "Trang chủ", icon: GridIcon, main: true },
  { href: "/courses", label: "Khóa học", icon: ClassIcon, main: true },
  { href: "/schedule", label: "Lịch", icon: CalendarIcon, main: true },
  { href: "/materials", label: "Tài liệu", icon: MaterialsIcon, main: true },
  { href: "/homework", label: "Bài tập", icon: BookIcon, main: false },
  { href: "/report", label: "Báo cáo", icon: ReportIcon, main: false },
  { href: "/messages", label: "Tin nhắn", icon: MessageIcon, main: true },
  { href: "/tuition", label: "Học phí", icon: TuitionIcon, main: true },
] as const;

export interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    onClose?.();
    logout();
  };

  return (
    <aside
      className={`${styles.aside} ${open ? styles.asideOpen : styles.asideClosed}`}
    >
      <div className={styles.inner}>
        <div className={styles.logoSection}>
          <Text variant="BUTTON_LABEL.LARGE">Fourier LMS</Text>
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
                <span className={styles.linkLabel}>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.bottom}>
          <button
            type="button"
            onClick={handleLogout}
            className={styles.logoutLink}
          >
            <LogoutIcon className={styles.logoutIcon} />
            <span className={styles.linkLabel}>Đăng xuất</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
