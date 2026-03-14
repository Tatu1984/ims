"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  return (
    <div className="flex h-screen overflow-hidden bg-content-bg">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      <div
        className="flex flex-1 flex-col overflow-hidden transition-all duration-300"
        style={{
          marginLeft: collapsed
            ? "var(--sidebar-collapsed)"
            : "var(--sidebar-width)",
        }}
      >
        <Header onMenuToggle={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
