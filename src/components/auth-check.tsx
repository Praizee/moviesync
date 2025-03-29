"use client"

import type React from "react"

import { useSupabase } from "@/components/supabase-provider"

interface AuthCheckProps {
  children: React.ReactNode
  fallback: React.ReactNode
}

export function AuthCheck({ children, fallback }: AuthCheckProps) {
  const { session } = useSupabase()

  if (!session) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

