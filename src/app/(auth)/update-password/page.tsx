"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const supabase = createClient();
      
      // Check if there's already a session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setHasSession(true);
        setChecking(false);
        return;
      }

      // No session — check URL for tokens (Supabase may have put them in the hash)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!error) {
          setHasSession(true);
          // Clean up the URL hash
          window.history.replaceState(null, "", window.location.pathname);
        } else {
          setError("Your reset link has expired or already been used. Please request a new one.");
        }
      } else {
        setError("Your reset link has expired or already been used. Please request a new one.");
      }
      setChecking(false);
    }
    checkSession();
  }, []);

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

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Loader2 size={20} className="animate-spin" />
          Verifying reset link...
        </div>
      </main>
    );
  }

  if (!hasSession) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="w-full max-w-sm space-y-4 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
          <h1 className="text-2xl font-bold">Reset link invalid</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
          <a href="/forgot-password" className="inline-block mt-4 rounded-lg bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 font-semibold hover:opacity-80 transition">
            Request a new link
          </a>
        </div>
      </main>
    );
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
          placeholder="New password (min 8 chars)" 
          className="w-full rounded-lg border p-3 outline-none focus:border-black dark:focus:border-white bg-transparent" 
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