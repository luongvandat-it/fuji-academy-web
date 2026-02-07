"use client";

import { getSchedule } from "@/service/modules/schedule/logic";
import { useEffect } from "react";

export default function Home() {
  const loadSchedule = async () => {
    const response = await getSchedule()
    if (response?.success) {
    }
  }

  useEffect(() => {
    loadSchedule()
  }, [])
  return (
    <div>
      <p>Hello World</p>
    </div>
  );
}
