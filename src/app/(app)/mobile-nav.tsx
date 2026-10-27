"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import SidebarNav from "./sidebar-nav";
import ThemeToggle from "./theme-toggle";

export default function MobileNav({ orgName, userName, initials }: { orgName: string, userName: string, initials: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-gray-800 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold">R</div>
          <span className="font-bold uppercase tracking-wider text-sm">RegulaAI</span>
        </div>
        <button onClick={() => setOpen(true)} className="p-2 text-gray-600 dark:text-gray-300">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-[280px] bg-white dark:bg-[#0f0f0f] h-full shadow-2xl flex flex-col p-5 overflow-y-auto">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 p-2 text-gray-500">
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mt-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold">R</div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide">RegulaAI</p>
                <p className="text-xs text-gray-500 font-medium truncate max-w-[150px]">{orgName}</p>
              </div>
            </div>

            <div onClick={() => setOpen(false)}>
              <SidebarNav />
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
              <ThemeToggle />
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">{initials}</div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold truncate max-w-[120px]">{userName}</p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                </div>
                <form action="/auth/logout" method="post">
                  <button title="Sign out" className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}