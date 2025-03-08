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
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </SidebarProvider>
      <Toaster />
    </ThemeProvider>
  );
}
