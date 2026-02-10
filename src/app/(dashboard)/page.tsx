"use client";

import { getSchedule, ScheduleData } from "@/service/modules/schedule/logic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [schedule, setSchedule] = useState<ScheduleData[]>([]);
  const loadSchedule = async () => {
    const response = await getSchedule();
    if (response?.success) {
      setSchedule(response.data);
    } else if (response && !response.success && "status" in response && response.status === 404) {
      router.replace("/login");
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);
  return (
    <div className="p-6">
      <p>Hello World</p>
    </div>
  );
}
