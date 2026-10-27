import { createServerSupabase } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const supabase = createServerSupabase();
  const { data: logs } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Immutable log of all compliance actions. Required for SOC2 and regulatory evidence.
        </p>
      </header>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-gray-500">Action</th>
              <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-gray-500">Entity</th>
              <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-gray-500">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {logs && logs.length > 0 ? (
              logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium capitalize">{log.action.replace(".", " ")}</td>
                  <td className="px-6 py-4 text-gray-500 capitalize">{log.entity_type?.replace("_", " ") || "-"}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">No audit logs yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}