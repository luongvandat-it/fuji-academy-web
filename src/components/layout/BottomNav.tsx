"use client";

import { CalendarIcon, ClassIcon, GridIcon, TuitionIcon } from "@/icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./BottomNav.module.scss";

const items = [
  { href: "/", label: "Trang chủ", icon: GridIcon },
  { href: "/schedule", label: "Lịch", icon: CalendarIcon },
  { href: "/class", label: "Lớp học", icon: ClassIcon },
  { href: "/tuition", label: "Học phí", icon: TuitionIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.bottomNav} aria-label="Điều hướng chính">
      {items.map(({ href, label, icon: Icon }) => {
        const isActive =
          pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
          >
            <Icon
              className={isActive ? styles.iconActive : styles.icon}
              aria-hidden
            />
            <span className={styles.label}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
