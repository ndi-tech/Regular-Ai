"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (error) return setError(error.message);
    // If email confirmation is disabled in Supabase, session is created immediately:
    if (data.session) {
      router.push("/onboarding");
    } else {
      router.push("/login?msg=Check+your+email+to+confirm");
    }
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 bg-white p-8 rounded-lg border shadow-sm">
        <div>
          <Link href="/" className="text-sm text-gray-500 hover:underline">← RegulaAI</Link>
          <h1 className="text-2xl font-semibold mt-3">Create your account</h1>
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
        <input required value={fullName} onChange={(e) => setFullName(e.target.value)}
          placeholder="Full name" className="w-full rounded-md border p-3 outline-none focus:border-black" />
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Work email" className="w-full rounded-md border p-3 outline-none focus:border-black" />
        <input type="password" required minLength={8}
          value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 8 chars)" className="w-full rounded-md border p-3 outline-none focus:border-black" />
        <button disabled={loading}
          className="w-full rounded-md bg-black text-white p-3 font-medium disabled:opacity-50">
          {loading ? "Creating account…" : "Create account"}
        </button>
        <p className="text-sm text-gray-600 text-center">
          Have an account? <Link href="/login" className="underline">Sign in</Link>
        </p>
      </form>
    </main>
  );
}