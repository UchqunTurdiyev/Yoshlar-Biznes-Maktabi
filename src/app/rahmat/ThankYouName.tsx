"use client";

import { useEffect, useState } from "react";

export function ThankYouName() {
  const [name, setName] = useState("");
  useEffect(() => {
    try {
      setName(sessionStorage.getItem("ybm_name") || "");
    } catch {}
  }, []);
  return name ? <>, {name}</> : null;
}
