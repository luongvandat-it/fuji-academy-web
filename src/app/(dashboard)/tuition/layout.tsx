import type { Metadata } from "next";
import { APP_NAME } from "@/lib";

export const metadata: Metadata = {
  title: `Tuition | ${APP_NAME}`,
  description:
    "View your tuition debts, payment status, due dates and total amount. Manage and track tuition fees in one place.",
  openGraph: {
    title: `Tuition | ${APP_NAME}`,
    description:
      "View your tuition debts, payment status, due dates and total amount. Manage and track tuition fees in one place.",
    type: "website",
  },
  robots: "index, follow",
  alternates: { canonical: "/tuition" },
};

const tuitionJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `Tuition | ${APP_NAME}`,
  description:
    "View your tuition debts, payment status, due dates and total amount. Manage and track tuition fees in one place.",
};

export default function TuitionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tuitionJsonLd) }}
      />
      {children}
    </>
  );
}
