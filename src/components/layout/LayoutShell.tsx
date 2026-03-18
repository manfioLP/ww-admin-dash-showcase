"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/sidebar";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile top bar */}
      <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center gap-3 bg-[#1a1a2e] px-4 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="flex items-center gap-2 text-white">
          <span className="text-xl">🐊</span>
          <span className="text-base font-semibold tracking-tight">WaniWani</span>
        </span>
      </header>

      <main className="min-h-screen bg-[#f8f9fa] pt-14 lg:ml-60 lg:pt-0">
        {children}
      </main>
    </>
  );
}
