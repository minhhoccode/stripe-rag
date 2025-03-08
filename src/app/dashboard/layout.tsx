"use client"

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from '@/components/ui/sidebar';
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
        <SidebarProvider >
            <AppSidebar />
        </SidebarProvider>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
