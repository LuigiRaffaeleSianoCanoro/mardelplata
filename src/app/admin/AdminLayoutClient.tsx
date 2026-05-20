"use client";

import AppShell from "@/components/app/AppShell";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell isAdmin>{children}</AppShell>;
}
