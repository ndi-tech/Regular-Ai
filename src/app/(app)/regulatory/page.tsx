"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegulatoryPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title) return;
    setBusy(true); setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("jurisdiction", jurisdiction);

    try {
      const res = await fetch("/api/documents", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      
      if (data.warning) {
        alert(data.warning);
      }
      
      router.push(`/regulatory/${data.document.id}`);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8 max-w-3xl pb-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Regulatory Intelligence</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Upload a regulatory document. Our AI will analyze requirements, dates, and impacts.</p>
      </header>

      {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-900">{error}</p>}

      <form onSubmit={submit} className="glass p-8 rounded-2xl space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Document Title</label>
          <input required value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. EU AI Act 2024" className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Jurisdiction (optional)</label>
          <input value={jurisdiction} onChange={e => setJurisdiction(e.target.value)}
            placeholder="e.g. European Union" className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">File (PDF, DOCX, TXT)</label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer relative">
            <input type="file" required accept=".pdf,.docx,.txt,.csv" onChange={e => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {file ? <span className="font-semibold text-blue-600 dark:text-blue-400">{file.name}</span> : "Drag & drop or click to choose a file"}
            </p>
          </div>
        </div>
        
        <button disabled={busy} type="submit"
          className="w-full rounded-lg bg-black dark:bg-white text-white dark:text-black px-5 py-4 font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
          {busy ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"></div>
              Extracting & Analyzing…
            </>
          ) : "Upload & Analyze"}
        </button>
        {busy && <p className="text-xs text-gray-500 dark:text-gray-400 text-center animate-pulse">Groq AI is reading the document. This takes 5–15 seconds.</p>}
      </form>
    </div>
  );
}