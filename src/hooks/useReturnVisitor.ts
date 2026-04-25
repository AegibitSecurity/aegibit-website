"use client";
import { useEffect, useState } from "react";

export function useReturnVisitor(): boolean {
  const [isReturn, setIsReturn] = useState(false);
  useEffect(() => {
    const prev = localStorage.getItem("vc_visited");
    if (prev) {
      setIsReturn(true);
    } else {
      localStorage.setItem("vc_visited", "1");
    }
  }, []);
  return isReturn;
}
