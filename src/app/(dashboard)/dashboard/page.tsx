import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { DashboardTabs } from "@/components/dashboard-tabs";

export default async function DashboardPage() {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      <DashboardTabs />
    </div>
  );
}

