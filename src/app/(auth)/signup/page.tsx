import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { AuthForm } from "@/components/auth-form"

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string }
}) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect(searchParams.callbackUrl || "/dashboard")
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-8">Create a MovieSync Account</h1>
      <AuthForm mode="signup" callbackUrl={searchParams.callbackUrl} />
    </div>
  )
}

