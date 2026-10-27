import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createServerSupabase();

  const { count: docCount } = await supabase
    .from("regulatory_documents")
    .select("*", { count: "exact", head: true })
    .eq("status", "analyzed");

  const { count: asmPending } = await supabase
    .from("impact_assessments")
    .select("*", { count: "exact", head: true })
    .eq("human_review_status", "pending");

  const { count: taskOpen } = await supabase
    .from("compliance_tasks")
    .select("*", { count: "exact", head: true })
    .in("status", ["not_started", "in_progress", "blocked"]);

  // Fetch the latest documents and their assessment status (if any)
  const { data: recentDocs } = await supabase
    .from("regulatory_documents")
    .select(`
      id, title, jurisdiction, status, created_at,
      regulatory_changes (id, impact_assessments (human_review_status))
    `)
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <div className="space-y-10 pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Overview</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time compliance posture based on your organization&apos;s data.
          </p>
        </div>
        <Link href="/regulatory" className="hidden md:inline-flex rounded-xl bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 font-medium hover:opacity-80 transition">
          + New Document
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/regulatory" className="group relative overflow-hidden rounded-2xl glass card-hover p-8">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          </div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Regulatory Updates</p>
          <p className="text-5xl font-extrabold mt-2 text-gray-900 dark:text-white">{docCount ?? 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Documents analyzed</p>
        </Link>

        <Link href="/assessments" className="group relative overflow-hidden rounded-2xl glass card-hover p-8">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Pending Reviews</p>
          <p className="text-5xl font-extrabold mt-2 text-gray-900 dark:text-white">{asmPending ?? 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Awaiting human review</p>
        </Link>

        <Link href="/tasks" className="group relative overflow-hidden rounded-2xl glass card-hover p-8">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          </div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Open Actions</p>
          <p className="text-5xl font-extrabold mt-2 text-gray-900 dark:text-white">{taskOpen ?? 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Incomplete compliance tasks</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-2xl glass p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Recent Regulatory Activity</h2>
            <Link href="/regulatory" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">View all →</Link>
          </div>
          
          {!recentDocs || recentDocs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No documents uploaded yet.</p>
              <Link href="/regulatory" className="inline-block rounded-lg bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 font-medium hover:opacity-80 transition">
                Upload your first document
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDocs.map((doc: any) => {
                // Determine assessment status if it exists
                const assessments = doc.regulatory_changes?.flatMap((c: any) => c.impact_assessments || []) || [];
                const latestAssessment = assessments[0];
                
                return (
                  <Link key={doc.id} href={`/regulatory/${doc.id}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{doc.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{doc.jurisdiction || "No jurisdiction"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {latestAssessment ? (
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          latestAssessment.human_review_status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          latestAssessment.human_review_status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {latestAssessment.human_review_status === 'pending' ? 'Pending Review' : latestAssessment.human_review_status}
                        </span>
                      ) : (
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          doc.status === 'analyzed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {doc.status.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl glass p-8">
          <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/regulatory" className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition border border-transparent hover:border-gray-300 dark:hover:border-gray-600">
              <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0 text-lg leading-none">+</div>
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-white">Upload Document</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Analyze a new regulation</p>
              </div>
            </Link>
            <Link href="/assessments" className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition border border-transparent hover:border-gray-300 dark:hover:border-gray-600">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-white">Impact Assessments</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Review AI analysis</p>
              </div>
            </Link>
            <Link href="/tasks" className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition border border-transparent hover:border-gray-300 dark:hover:border-gray-600">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-white">Action Center</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Track open tasks</p>
              </div>
            </Link>
          </div>
        </section>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-500 max-w-2xl">
        RegulaAI provides AI-assisted regulatory analysis and workflow support.
        It does not constitute legal advice or guarantee regulatory compliance.
      </p>
    </div>
  );
}