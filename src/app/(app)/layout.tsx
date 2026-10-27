import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import ThemeToggle from "./theme-toggle";
import SidebarNav from "./sidebar-nav";
import MobileNav from "./mobile-nav";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("full_name, organization_id")
    .eq("user_id", user.id).single();

  if (!profile?.organization_id) redirect("/onboarding");

  const { data: org } = await supabase
    .from("organizations").select("name").eq("id", profile.organization_id).single();

  const orgName = org?.name ?? "Your organization";
  const initials = profile.full_name ? profile.full_name.substring(0, 2).toUpperCase() : "RA";

  return (
    <div className="min-h-screen md:grid md:grid-cols-[280px_1fr] bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans">
      
      {/* Mobile Header & Drawer */}
      <MobileNav orgName={orgName} userName={profile.full_name || "User"} initials={initials} />

      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f0f0f] p-5 flex-col justify-between z-10 relative shadow-sm dark:shadow-2xl">
        <div>
          <div className="flex items-center gap-3 px-2 mb-8 mt-2">
            <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-lg">R</div>
            <div>
              <p className="text-sm font-bold tracking-wide text-gray-900 dark:text-white uppercase">RegulaAI</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate max-w-[150px]">{orgName}</p>
            </div>
          </div>
          <SidebarNav />
        </div>

        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          <ThemeToggle />
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">{initials}</div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">{profile.full_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
              </div>
            </div>
            <form action="/auth/logout" method="post">
              <button title="Sign out" className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </button>
            </form>
          </div>
        </div>
      </aside>
      
      {/* MAIN CONTENT */}
      <main className="relative pt-16 md:pt-0 p-4 md:p-10 max-w-[1600px] overflow-y-auto h-screen">
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/5 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}