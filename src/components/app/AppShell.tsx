"use client";

import { useEffect, useState, type ReactNode } from "react";
import AppSidebar from "./AppSidebar";

interface AppShellProps {
  isAdmin?: boolean;
  children: ReactNode;
}

export default function AppShell({ isAdmin, children }: AppShellProps) {
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setScanning(false), 1100);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen app-canvas">
      <AppSidebar isAdmin={isAdmin} />
      <div className="app-shell-content">{children}</div>
      {scanning && <div className="shell-scan-line" aria-hidden="true" />}
    </div>
  );
}
