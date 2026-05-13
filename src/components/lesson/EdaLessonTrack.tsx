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

/** Traccia progresso per sotto-pagine EDA (slug composto). */
export function EdaLessonTrack({ pathKey }: { pathKey: string }) {
  const lessonSlug = pathKey ? `eda/${pathKey}` : "eda";

  useEffect(() => {
    const clientId = getClientId();
    if (!clientId) return;
    void fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonSlug,
        clientId,
        status: "viewed",
      }),
    }).catch(() => {
      /* best-effort */
    });
  }, [lessonSlug]);

  return null;
}
