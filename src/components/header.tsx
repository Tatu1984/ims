"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  onMenuToggle: () => void;
}

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/assets": "Assets",
  "/software": "Software",
  "/licenses": "Licenses",
  "/users": "Users",
  "/reports": "Reports",
  "/settings": "Settings",
  "/tickets": "Tickets",
  "/audit-log": "Audit Log",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0) {
    const base = `/${segments[0]}`;
    if (pageTitles[base]) return pageTitles[base];
    return segments[0].charAt(0).toUpperCase() + segments[0].slice(1).replace(/-/g, " ");
  }
  return "Dashboard";
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 lg:px-6">
      {/* Left: Menu toggle + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <nav className="flex items-center gap-1.5 text-sm">
          <span className="text-zinc-400">ITAM</span>
          <span className="text-zinc-600">/</span>
          <span className="font-medium text-zinc-100">{pageTitle}</span>
        </nav>
      </div>

      {/* Center: Search bar */}
      <div className="hidden md:flex items-center w-full max-w-[400px] mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search hardware, software, licenses..."
            className="w-full bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 pl-10 focus-visible:ring-zinc-600"
          />
        </div>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-1">
        {/* Notification bell dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                className="relative rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  3
                </span>
              </button>
            }
          />
          <DropdownMenuContent
            align="end"
            className="w-80 bg-zinc-900 border-zinc-800 text-zinc-100"
          >
            <DropdownMenuLabel className="text-zinc-100">
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="flex flex-col items-start gap-1 text-zinc-100 cursor-pointer">
              <span className="text-sm">New asset registered</span>
              <span className="text-xs text-zinc-400">2 minutes ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 text-zinc-100 cursor-pointer">
              <span className="text-sm">License expiring soon</span>
              <span className="text-xs text-zinc-400">1 hour ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 text-zinc-100 cursor-pointer">
              <span className="text-sm">Audit report ready</span>
              <span className="text-xs text-zinc-400">3 hours ago</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="justify-center text-sm text-zinc-400 cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className="mx-2 h-6 w-px bg-zinc-800" />

        {/* User avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-zinc-800 transition-colors"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-600 text-sm font-semibold text-white">
                    SA
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium text-zinc-100 lg:block">
                  System Admin
                </span>
              </button>
            }
          />
          <DropdownMenuContent
            align="end"
            className="w-56 bg-zinc-900 border-zinc-800 text-zinc-100"
          >
            <DropdownMenuLabel className="flex flex-col">
              <span className="text-sm font-medium text-zinc-100">
                System Admin
              </span>
              <span className="text-xs font-normal text-zinc-400">
                admin@company.com
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="text-zinc-100 cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/settings" />} className="text-zinc-100 cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="text-zinc-100 cursor-pointer">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
