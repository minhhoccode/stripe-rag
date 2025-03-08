"use client"

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from "@/components/theme-provider";
import dynamic from "next/dynamic";

const Toaster = dynamic(() => import("sonner").then((mod) => mod.Toaster), {
  ssr: false,
  loading: () => null
});
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex h-screen">
          <SidebarProvider>
              <AppSidebar />
          </SidebarProvider>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
