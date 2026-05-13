"use client";

import { useEffect } from "react";

function getClientId(): string | null {
  if (typeof window === "undefined") return null;
  const key = "hub_client_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function LessonTrack({ slug }: { slug: string }) {
  useEffect(() => {
    const clientId = getClientId();
    if (!clientId) return;
    void fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonSlug: slug,
        clientId,
        status: "viewed",
      }),
    }).catch(() => {
      /* best-effort */
    });
  }, [slug]);

  return null;
}
