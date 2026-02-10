"use client";

import { getSchedule, ScheduleData } from "@/service/modules/schedule/logic";
import { useEffect, useState } from "react";

export default function Home() {
  const [schedule, setSchedule] = useState<ScheduleData[]>([]);
  const loadSchedule = async () => {
    const response = await getSchedule();
    if (response?.success) setSchedule(response.data);
  };
  useEffect(() => {
    loadSchedule();
  }, []);
  return (
    <div className="p-6">
      <p>Comming soon...</p>
    </div>
  );
}
