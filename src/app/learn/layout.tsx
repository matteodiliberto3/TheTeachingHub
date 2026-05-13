import { HubMobileNav } from "@/components/hub/HubMobileNav";
import { HubSidebar } from "@/components/hub/HubSidebar";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1">
      <HubSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <HubMobileNav />
        <div className="min-h-0 min-w-0 w-full flex-1">{children}</div>
      </div>
    </div>
  );
}
