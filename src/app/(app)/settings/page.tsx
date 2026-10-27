"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteAccount() {
    if (confirmText !== "DELETE") return;
    setBusy(true); setError(null);

    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete account");
      }
      
      // Sign out locally and redirect to home
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl pb-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your account and platform preferences.</p>
      </header>

      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <h2 className="text-lg font-bold">AI Provider</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          RegulaAI is currently using Groq for free-tier AI processing. To use a different provider, update your environment variables.
        </p>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-mono text-gray-600 dark:text-gray-300">
          GROQ_MODEL = openai/gpt-oss-120b
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <h2 className="text-lg font-bold">Data & Privacy</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your uploaded documents and assessments are stored securely in Supabase. Row-Level Security ensures your data is never visible to other organizations.
        </p>
      </section>

      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-bold mb-2">About RegulaAI</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          RegulaAI v0.1.0 - Turn regulatory changes into business action.<br/>
          <span className="text-xs text-gray-500 mt-2 block">RegulaAI provides AI-assisted regulatory analysis and workflow support. It does not constitute legal advice or guarantee regulatory compliance.</span>
        </p>
      </section>

      {/* DANGER ZONE */}
      <section className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/30 p-6">
        <div className="flex items-center gap-2 mb-2 text-red-700 dark:text-red-400">
          <AlertTriangle size={20} />
          <h2 className="text-lg font-bold">Danger Zone</h2>
        </div>
        <p className="text-sm text-red-600 dark:text-red-300 mb-4">
          Once you delete your account, there is no going back. All of your organization's documents, tasks, evidence, and audit logs will be permanently deleted.
        </p>
        <button 
          onClick={() => setShowDelete(true)}
          className="rounded-lg bg-red-600 text-white px-5 py-2.5 font-medium hover:bg-red-700 transition"
        >
          Delete Account
        </button>
      </section>

      {/* DELETE MODAL */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Delete Account?</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This will permanently delete your account and your entire organization's data. This action cannot be undone.
            </p>
            <div className="pt-2">
              <label className="block text-sm font-semibold mb-1">Type <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">DELETE</span> to confirm</label>
              <input 
                type="text" 
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-lg border p-3 outline-none focus:border-red-500 bg-transparent"
              />
            </div>
            
            {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
            
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => { setShowDelete(false); setConfirmText(""); setError(null); }} 
                disabled={busy}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={deleteAccount} 
                disabled={confirmText !== "DELETE" || busy}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {busy ? <><Loader2 size={16} className="animate-spin" /> Deleting...</> : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}