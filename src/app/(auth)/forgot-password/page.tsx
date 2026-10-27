"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for a password reset link.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-[#0a0a0a]">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="mb-6">
          <Link href="/login" className="text-sm text-gray-500 hover:text-black dark:hover:text-white transition">← Back to login</Link>
          <h1 className="text-2xl font-bold mt-3">Reset password</h1>
          <p className="text-sm text-gray-500 mt-1">We will send you a link to reset your password.</p>
        </div>
        
        {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</p>}
        {message && <p className="text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded">{message}</p>}
        
        <input 
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address" className="w-full rounded-lg border p-3 outline-none focus:border-black dark:focus:border-white bg-transparent" 
        />
        
        <button 
          disabled={loading || !!message}
          className="w-full rounded-lg bg-black dark:bg-white text-white dark:text-black p-3 font-semibold disabled:opacity-50 flex items-center justify-center gap-2 transition"
        >
          {loading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : "Send reset link"}
        </button>
      </form>
    </main>
  );
}