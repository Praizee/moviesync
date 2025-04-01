import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { ProfileForm } from "@/components/profile-form";

export default async function ProfilePage() {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login?callbackUrl=/profile");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">
        Your Profile
      </h1>
      <ProfileForm
        initialData={
          profile || { id: session.user.id, name: "", avatar_url: "" }
        }
      />
    </div>
  );
}

