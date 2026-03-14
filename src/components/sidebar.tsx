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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <TooltipProvider>
      <aside
        className="flex flex-col h-screen fixed left-0 top-0 z-40 bg-zinc-950 border-r border-zinc-800 transition-all duration-300 ease-in-out"
        style={{ width: collapsed ? 72 : 260 }}
      >
        {/* Top gradient accent bar */}
        <div className="h-[2px] w-full bg-gradient-to-r from-blue-500 via-blue-400 to-purple-500 shrink-0" />

        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-zinc-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 shrink-0">
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
        <ScrollArea className="flex-1 overflow-hidden">
          <nav className="py-4 px-2">
            {navSections.map((section) => (
              <div key={section.title} className="mb-5">
                {!collapsed && (
                  <p className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                    {section.title}
                  </p>
                )}
                {collapsed && <div className="mb-2" />}
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;

                    const linkContent = (
                      <Link
                        href={item.href}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                          transition-all duration-200 relative group
                          ${
                            active
                              ? "bg-blue-500/10 text-blue-400 border-l-[3px] border-blue-500 pl-[9px]"
                              : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200 border-l-[3px] border-transparent pl-[9px]"
                          }
                        `}
                      >
                        <Icon
                          size={20}
                          className={`shrink-0 transition-colors duration-200 ${
                            active
                              ? "text-blue-400"
                              : "text-zinc-400 group-hover:text-zinc-200"
                          }`}
                        />
                        <span
                          className="whitespace-nowrap transition-opacity duration-300 overflow-hidden"
                          style={{
                            opacity: collapsed ? 0 : 1,
                            width: collapsed ? 0 : "auto",
                          }}
                        >
                          {item.label}
                        </span>
                      </Link>
                    );

                    if (collapsed) {
                      return (
                        <li key={item.href}>
                          <Tooltip>
                            <TooltipTrigger render={<div />}>
                              {linkContent}
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={8}>
                              {item.label}
                            </TooltipContent>
                          </Tooltip>
                        </li>
                      );
                    }

                    return <li key={item.href}>{linkContent}</li>;
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Collapse Toggle */}
        <div className="border-t border-zinc-800 p-3">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger
                onClick={onToggle}
                className="flex items-center justify-center w-full py-2.5 rounded-lg text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200 transition-colors duration-200 cursor-pointer"
              >
                <ChevronRight size={20} />
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                Expand sidebar
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={onToggle}
              className="flex items-center justify-center w-full py-2.5 rounded-lg text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200 transition-colors duration-200 cursor-pointer"
            >
              <ChevronLeft size={20} />
              <span className="ml-3 text-sm font-medium">Collapse</span>
            </button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
