"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Monitor,
  Package,
  KeyRound,
  Ticket,
  FileBarChart,
  Users,
  Settings,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Server,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Hardware Assets", href: "/assets", icon: Monitor },
      { label: "Software", href: "/software", icon: Package },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { label: "Licenses", href: "/licenses", icon: KeyRound },
      { label: "Tickets", href: "/tickets", icon: Ticket },
      { label: "Reports", href: "/reports", icon: FileBarChart },
    ],
  },
  {
    title: "ADMIN",
    items: [
      { label: "Users", href: "/users", icon: Users },
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Audit Log", href: "/audit-log", icon: ScrollText },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="flex flex-col h-screen fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? 72 : 260,
        backgroundColor: "#0f172a",
      }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 shrink-0">
            <Server size={20} className="text-white" />
          </div>
          <span
            className="text-xl font-bold text-white whitespace-nowrap transition-opacity duration-300"
            style={{ opacity: collapsed ? 0 : 1 }}
          >
            ITAM
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2">
        {navSections.map((section) => (
          <div key={section.title} className="mb-4">
            {!collapsed && (
              <p className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                        transition-all duration-200 relative group
                        ${
                          active
                            ? "bg-blue-600/15 text-blue-400 border-l-[3px] border-blue-500 pl-[9px]"
                            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-l-[3px] border-transparent pl-[9px]"
                        }
                      `}
                    >
                      <Icon
                        size={20}
                        className={`shrink-0 ${active ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"}`}
                      />
                      <span
                        className="whitespace-nowrap transition-opacity duration-300"
                        style={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-slate-700/50 p-3">
        <button
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex items-center justify-center w-full py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors duration-200"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && (
            <span className="ml-3 text-sm font-medium">Collapse</span>
          )}
        </button>
      </div>
    </aside>
  );
}
