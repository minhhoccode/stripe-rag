import { TempoInit } from "@/components/tempo-init";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SidebarProvider } from '@/components/ui/sidebar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RAGify - Multi-Tenant RAG Chatbot Platform",
  description:
    "Create, customize, and manage AI-powered chatbots with Retrieval Augmented Generation across your organization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          <TempoInit />
        </ThemeProvider>
      </body>
    </html>
  );
}
