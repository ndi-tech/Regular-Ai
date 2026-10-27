import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AssessmentsPage({ searchParams }: { searchParams: { status?: string } }) {
  const supabase = createServerSupabase();
  const filterStatus = searchParams.status || "all";

  let query = supabase
    .from("impact_assessments")
    .select(`
      id, impact_level, human_review_status, created_at, reasoning,
      affected_departments,
      regulatory_changes (title)
    `)
    .order("created_at", { ascending: false });

  if (filterStatus !== "all") {
    query = query.eq("human_review_status", filterStatus);
  }

  const { data: assessments } = await query;

  const tabs = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Impact Assessments</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          AI-generated business impact analysis. Each assessment requires human review.
        </p>
      </header>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-px">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/assessments?status=${tab.value}`}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filterStatus === tab.value
                ? "border-black dark:border-white text-black dark:text-white"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {!assessments || assessments.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">No {filterStatus === "all" ? "" : filterStatus} assessments found.</p>
          {filterStatus === "all" && (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Upload a regulatory document and click "Assess Business Impact" to get started.</p>
              <Link href="/regulatory" className="inline-block mt-6 rounded-xl bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 font-medium hover:opacity-80 transition">
                Go to Regulatory Intelligence
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {assessments.map((a: any) => (
            <Link key={a.id} href={`/assessments/${a.id}`}
              className="block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:border-blue-500 dark:hover:border-blue-500 transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg text-gray-900 dark:text-white">{a.regulatory_changes?.title || "Unknown regulation"}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2">{a.reasoning}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {a.affected_departments?.slice(0, 4).map((d: string) => (
                      <span key={d} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-md text-xs font-medium">{d}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    a.impact_level === "critical" ? "bg-red-600 text-white" :
                    a.impact_level === "high" ? "bg-orange-500 text-white" :
                    a.impact_level === "medium" ? "bg-yellow-400 text-black" :
                    "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}>{a.impact_level}</span>
                  <p className={`text-xs font-semibold mt-3 uppercase tracking-wider ${
                    a.human_review_status === "approved" ? "text-emerald-600 dark:text-emerald-400" :
                    a.human_review_status === "rejected" ? "text-red-600 dark:text-red-400" :
                    "text-amber-600 dark:text-amber-400"
                  }`}>
                    {a.human_review_status.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}