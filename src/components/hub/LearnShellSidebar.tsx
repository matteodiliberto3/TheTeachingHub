"use client";

import { usePathname } from "next/navigation";
import { HubSidebar } from "@/components/hub/HubSidebar";
import { ContextualSidebar } from "@/components/hub/ContextualSidebar";
import { edaContextualNav } from "@/lib/lessons/eda/nav";

export function LearnShellSidebar() {
  const pathname = usePathname();
  const inEda = pathname === "/learn/eda" || pathname.startsWith("/learn/eda/");

  if (inEda) {
    return (
      <ContextualSidebar
        contextTitle="Event-Driven Architecture"
        contextSubtitle="Percorso a due livelli dalla mind map operativa al laboratorio."
        homeHref="/learn"
        homeLabel="Tutti i moduli"
        sections={edaContextualNav}
      />
    );
  }

  return <HubSidebar />;
}
