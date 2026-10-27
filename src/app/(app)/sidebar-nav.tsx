"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, ShieldAlert, CheckSquare, FolderOpen, Bot, History, Building2, Settings } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/regulatory", label: "Regulatory Intelligence", icon: FileText },
  { href: "/assessments", label: "Impact Assessments", icon: ShieldAlert },
  { href: "/tasks", label: "Action Center", icon: CheckSquare },
  { href: "/evidence", label: "Evidence", icon: FolderOpen },
  { href: "/copilot", label: "AI Copilot", icon: Bot },
  { href: "/audit", label: "Audit Trail", icon: History },
  { href: "/organization", label: "Organization", icon: Building2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1.5 mt-6">
      {NAV.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-black dark:bg-white text-white dark:text-black shadow-md shadow-black/5"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Icon size={18} className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white dark:text-black" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"}`} />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}