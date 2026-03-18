"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Bot, BarChart3, Radar, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/partners", label: "Partners", icon: Building2 },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/monitor", label: "Brand Monitor", icon: Radar },
  { href: "/settings", label: "Settings", icon: Settings },
];

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function Sidebar({ isOpen = false, onClose }: Props) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-[#0f0f1a] text-white transition-transform duration-300",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐊</span>
            <span className="text-lg font-semibold tracking-tight">WaniWani</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 hover:bg-white/10 hover:text-white transition-colors lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-2 flex flex-1 flex-col gap-0.5 px-3">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-[#6C5CE7] text-white shadow-sm"
                    : "text-gray-400 hover:bg-white/8 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-transform duration-150",
                    !isActive && "group-hover:scale-110"
                  )}
                />
                {item.label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/8 px-5 py-4">
          <p className="text-xs text-gray-600">WaniWani © 2026</p>
          <p className="text-xs text-gray-700">v1.0.0</p>
        </div>
      </aside>
    </>
  );
}
