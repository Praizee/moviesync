import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { AuthForm } from "@/components/auth-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect(searchParams.callbackUrl || "/dashboard");
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-8">
        Sign In to MovieSync
      </h1>
      <AuthForm callbackUrl={searchParams.callbackUrl} />
    </div>
  );
}

