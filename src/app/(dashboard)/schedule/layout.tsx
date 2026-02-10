import type { Metadata } from "next";
import { APP_NAME } from "@/lib";

export const metadata: Metadata = {
  title: `Schedule | ${APP_NAME}`,
  description:
    "View your schedule by day, week or month. Manage classes, teachers, rooms and reminders.",
  openGraph: {
    title: `Schedule | ${APP_NAME}`,
    description:
      "View your schedule by day, week or month. Manage classes, teachers, rooms and reminders.",
    type: "website",
  },
  robots: "index, follow",
  alternates: { canonical: "/schedule" },
};

const scheduleJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `Schedule | ${APP_NAME}`,
  description:
    "View your schedule by day, week or month. Manage classes, teachers, rooms and reminders.",
};

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(scheduleJsonLd) }}
      />
      {children}
    </>
  );
}
