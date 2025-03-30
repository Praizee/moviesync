"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  // Create a new Supabase client for the server action
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  });

  try {
    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return { error: "Unauthorized", success: false };
    }

    const name = formData.get("name") as string;
    const avatar_url = formData.get("avatar_url") as string;

    console.log("Server Action - Updating profile:", {
      userId: session.user.id,
      name,
      avatar_url,
    });

    // First, check if the profile exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", session.user.id)
      .single();

    let result;

    if (existingProfile) {
      // Update existing profile
      console.log("Updating existing profile");
      result = await supabase
        .from("profiles")
        .update({
          name,
          avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);
    } else {
      // Insert new profile
      console.log("Creating new profile");
      result = await supabase.from("profiles").insert({
        id: session.user.id,
        name,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
    }

    if (result.error) {
      console.error("Profile update error:", result.error);
      return {
        error: result.error.message,
        details: result.error,
        success: false,
      };
    }

    // Revalidate the profile page to show updated data
    revalidatePath("/profile");

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error: unknown) {
    console.error("Unexpected error in profile update:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
      success: false,
    };
  }
}

// "use server";

// import { createServerClient } from "@/lib/supabase-server";
// import { revalidatePath } from "next/cache";

// export async function updateProfile(formData: FormData) {
//   const supabase = await createServerClient();

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   if (!session) {
//     return { error: "Unauthorized", success: false };
//   }

//   const name = formData.get("name") as string;
//   const avatar_url = formData.get("avatar_url") as string;

//   console.log("Server Action - Updating profile:", {
//     userId: session.user.id,
//     name,
//     avatar_url,
//   });

//   try {
//     // First, check if the profile exists
//     const { data: existingProfile } = await supabase
//       .from("profiles")
//       .select("id")
//       .eq("id", session.user.id)
//       .single();

//     let result;

//     if (existingProfile) {
//       // Update existing profile
//       console.log("Updating existing profile");
//       result = await supabase
//         .from("profiles")
//         .update({
//           name,
//           avatar_url,
//           updated_at: new Date().toISOString(),
//         })
//         .eq("id", session.user.id);
//     } else {
//       // Insert new profile
//       console.log("Creating new profile");
//       result = await supabase.from("profiles").insert({
//         id: session.user.id,
//         name,
//         avatar_url,
//         updated_at: new Date().toISOString(),
//       });
//     }

//     if (result.error) {
//       console.error("Profile update error:", result.error);
//       return {
//         error: result.error.message,
//         details: result.error,
//         success: false,
//       };
//     }

//     // Revalidate the profile page to show updated data
//     revalidatePath("/profile");

//     return {
//       success: true,
//       message: "Profile updated successfully",
//     };
//   } catch (error: any) {
//     console.error("Unexpected error in profile update:", error);
//     return {
//       error: error.message || "An unexpected error occurred",
//       success: false,
//     };
//   }
// }

