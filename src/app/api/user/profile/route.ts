import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function GET() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ profile: data })
}

export async function PUT(request: Request) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name, avatar_url } = await request.json()

  const updates = {
    id: session.user.id,
    name,
    avatar_url,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("profiles").upsert(updates).eq("id", session.user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Profile updated successfully", profile: updates })
}

