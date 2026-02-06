import { Button } from "@/components";
import { APP_NAME } from "@/lib";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 p-8 dark:bg-zinc-950">
      <main className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Chào mừng đến {APP_NAME}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Dự án Next.js với cấu trúc gọn, dễ bảo trì. Xem README để biết cách
          chạy và vị trí code.
        </p>
        <div className="flex gap-3">
          <Button variant="primary">Bắt đầu</Button>
          <Button variant="outline">Tài liệu</Button>
        </div>
      </main>
    </div>
  );
}
