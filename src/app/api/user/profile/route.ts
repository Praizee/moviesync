// import { NextResponse } from "next/server";
// import { createServerClient } from "@/lib/supabase-server";

// export async function GET() {
//   const supabase = await createServerClient();

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { data, error } = await supabase
//     .from("profiles")
//     .select("*")
//     .eq("id", session.user.id)
//     .single();

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }

//   return NextResponse.json({ profile: data });
// }

// export async function PUT(request: Request) {
//   const supabase = await createServerClient();

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const body = await request.json();
//     const { name, avatar_url } = body;

//     console.log("Profile update request:", {
//       userId: session.user.id,
//       name,
//       avatar_url,
//     });

//     const updates = {
//       id: session.user.id,
//       name,
//       avatar_url,
//       updated_at: new Date().toISOString(),
//     };

//     // Use upsert instead of separate insert/update logic
//     const { data, error } = await supabase
//       .from("profiles")
//       .upsert(updates)
//       .select();

//     if (error) {
//       console.error("Profile update error:", error);
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     return NextResponse.json({
//       message: "Profile updated successfully",
//       profile: updates,
//     });
//   } catch (error: any) {
//     console.error("Error in profile update:", error);
//     return NextResponse.json(
//       {
//         error: error.message || "An unexpected error occurred",
//         stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}

export async function PUT(request: Request) {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, avatar_url } = body;

    console.log("Profile update request:", {
      userId: session.user.id,
      name,
      avatar_url,
    });

    const updates = {
      id: session.user.id,
      name,
      avatar_url,
      updated_at: new Date().toISOString(),
    };

    // Use the admin client to bypass RLS
    const adminClient = createAdminClient();

    const { error } = await adminClient.from("profiles").upsert(updates);

    if (error) {
      console.error("Profile update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: updates,
    });
  } catch (error: any) {
    console.error("Error in profile update:", error);
    return NextResponse.json(
      {
        error: error.message || "An unexpected error occurred",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

