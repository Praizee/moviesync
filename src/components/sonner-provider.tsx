"use client"

import { Toaster } from "sonner"
import { useTheme } from "next-themes"

export function SonnerProvider() {
  const { theme } = useTheme()

  return <Toaster position="bottom-right" theme={theme as "light" | "dark" | "system"} closeButton richColors />
}

