"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-[#0a0a0a]">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mt-3">Set new password</h1>
          <p className="text-sm text-gray-500 mt-1">Choose a strong new password.</p>
        </div>
        
        {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</p>}
        
        <input 
          type="password" required minLength={8}
          value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="New password" className="w-full rounded-lg border p-3 outline-none focus:border-black dark:focus:border-white bg-transparent" 
        />
        
        <button 
          disabled={loading}
          className="w-full rounded-lg bg-black dark:bg-white text-white dark:text-black p-3 font-semibold disabled:opacity-50 flex items-center justify-center gap-2 transition"
        >
          {loading ? <><Loader2 size={18} className="animate-spin" /> Updating...</> : "Update password"}
        </button>
      </form>
    </main>
  );
}