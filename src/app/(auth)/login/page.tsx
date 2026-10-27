"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-[#0a0a0a]">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="mb-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-black dark:hover:text-white transition">← Back to RegulaAI</Link>
          <h1 className="text-2xl font-bold mt-3">Sign in</h1>
        </div>
        
        {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</p>}
        
        <input 
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Email" className="w-full rounded-lg border p-3 outline-none focus:border-black dark:focus:border-white bg-transparent" 
        />
        <div>
          <input 
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" className="w-full rounded-lg border p-3 outline-none focus:border-black dark:focus:border-white bg-transparent" 
          />
          <div className="flex justify-end mt-1">
            <Link href="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
        
        <button 
          disabled={loading}
          className="w-full rounded-lg bg-black dark:bg-white text-white dark:text-black p-3 font-semibold disabled:opacity-50 flex items-center justify-center gap-2 transition"
        >
          {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : "Sign in"}
        </button>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center pt-2">
          No account? <Link href="/signup" className="underline font-medium">Create one</Link>
        </p>
      </form>
    </main>
  );
}