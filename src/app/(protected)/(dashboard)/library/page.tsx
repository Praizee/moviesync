import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { DashboardTabs } from "@/components/dashboard-tabs";

export default async function DashboardPage() {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login?callbackUrl=/library");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">
        Your Library
      </h1>
      <DashboardTabs />
    </div>
  );
}

