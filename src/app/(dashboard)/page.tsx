"use client";

import { Loading } from "@/components/ui";
import { getSchedule, ScheduleData } from "@/service/modules/schedule/logic";
import { useEffect, useState } from "react";

export default function Home() {
  const [schedule, setSchedule] = useState<ScheduleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSchedule = async () => {
    const response = await getSchedule();
    if (response?.success) setSchedule(response.data);
  };

  useEffect(() => {
    let mounted = true;
    loadSchedule().finally(() => {
      if (mounted) setIsLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center p-6">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6">
      <p className="text-black">Sắp ra mắt...</p>
    </div>
  );
}
