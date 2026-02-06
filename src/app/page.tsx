import Link from "next/link";
import { Button, Text } from "@/components";
import { APP_NAME } from "@/lib";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 p-8 dark:bg-zinc-950">
      <main className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <Text
          variant="HEADING.TWO"
          as="h1"
          className="text-zinc-900 dark:text-zinc-50"
        >
          Chào mừng đến {APP_NAME}
        </Text>
        <Text
          variant="BODY.MEDIUM"
          as="p"
          className="text-zinc-600 dark:text-zinc-400"
        >
          Dự án Next.js với cấu trúc gọn, dễ bảo trì. Xem README để biết cách
          chạy và vị trí code.
        </Text>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="primary">
              <Text variant="BUTTON_LABEL.MEDIUM">Đăng nhập</Text>
            </Button>
          </Link>
          <Button variant="secondary">
            <Text variant="BUTTON_LABEL.MEDIUM">Tài liệu</Text>
          </Button>
        </div>
      </main>
    </div>
  );
}
