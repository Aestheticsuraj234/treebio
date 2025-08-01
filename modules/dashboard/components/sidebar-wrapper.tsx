"use client"

import type React from "react"

import { SidebarProvider } from "@/components/ui/sidebar"

export function SidebarWrapper({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  return <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>
}
