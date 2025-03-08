"use client"

import { useEffect, useState } from "react";
import { createClient } from "../../../supabase/client";
import { InfoIcon, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ClientSubscriptionCheck } from "@/components/client-subscription-check";
import { PageHeader } from "@/components/page-header"

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/sign-in");
        return;
      }
      setUser(user);
    }
    getUser();
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <ClientSubscriptionCheck>
          <PageHeader title="dashboard" breadcrumbs={[{ title: "Report", href: "/" }, { title: "dashboard" }]} />
      <main>
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>This is a protected page only visible to authenticated users</span>
            </div>
          </header>

          {/* User Profile Section */}
          <section className="bg-card rounded-xl p-6 border shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <UserCircle size={48} className="text-primary" />
              <div>
                <h2 className="font-semibold text-xl">User Profile</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 overflow-hidden">
              <pre className="text-xs font-mono max-h-48 overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </section>
        </div>
      </main>
    </ClientSubscriptionCheck>
  );
}
