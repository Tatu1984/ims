"use client";

import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
}

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/assets": "Assets",
  "/devices": "Devices",
  "/software": "Software",
  "/licenses": "Licenses",
  "/users": "Users",
  "/reports": "Reports",
  "/settings": "Settings",
  "/vendors": "Vendors",
  "/contracts": "Contracts",
  "/maintenance": "Maintenance",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];

  // Try matching first segment for nested routes
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0) {
    const base = `/${segments[0]}`;
    if (pageTitles[base]) return pageTitles[base];
    // Capitalize first segment as fallback
    return segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
  }

  return "Dashboard";
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
      {/* Left: Menu toggle + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <nav className="flex items-center gap-1.5 text-sm">
          <span className="text-gray-400">ITAM</span>
          <span className="text-gray-300">/</span>
          <span className="font-medium text-gray-700">{pageTitle}</span>
        </nav>
      </div>

      {/* Center: Search bar */}
      <div className="hidden md:flex items-center w-full max-w-[400px] mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search hardware, software, licenses..."
            className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:bg-gray-50 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right: Notifications, Help, User */}
      <div className="flex items-center gap-1">
        {/* Notification bell */}
        <button
          className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* Help */}
        <button
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* Divider */}
        <div className="mx-2 h-6 w-px bg-gray-200" />

        {/* User avatar */}
        <button
          className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
          aria-label="User menu"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            SA
          </div>
          <span className="hidden text-sm font-medium text-gray-700 lg:block">
            System Admin
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </header>
  );
}
