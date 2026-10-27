"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DocumentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [doc, setDoc] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [assessing, setAssessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState("");

  useEffect(() => {
    fetch(`/api/documents/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setDoc(data.document);
      })
      .catch(err => setError(err.message));
  }, [params.id]);

  async function reanalyze() {
    setBusy(true); setError(null);
    setLoadingMsg("Contacting AI...");
    const timer1 = setTimeout(() => setLoadingMsg("Reading document..."), 3000);
    const timer2 = setTimeout(() => setLoadingMsg("Still analyzing. Free tier is a bit slow..."), 10000);

    try {
      const res = await fetch("/api/documents/reanalyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: params.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Re-analysis failed");
      
      const refreshRes = await fetch(`/api/documents/${params.id}`);
      const refreshData = await refreshRes.json();
      setDoc(refreshData.document);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      clearTimeout(timer1); clearTimeout(timer2);
      setBusy(false);
    }
  }

  async function assessImpact() {
    setAssessing(true); setError(null);
    setLoadingMsg("Comparing document to your business profile...");
    
    try {
      const changeRes = await fetch(`/api/documents/${params.id}/change`);
      const changeData = await changeRes.json();
      
      if (!changeData.change) throw new Error("No regulatory change found. Re-analyze the document first.");
      
      const res = await fetch("/api/ai/assess-impact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regulatory_change_id: changeData.change.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Impact assessment failed");
      
      router.push(`/assessments/${data.assessment_id}`);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setAssessing(false);
    }
  }

  if (error && !doc) return <div className="p-8 text-red-600 bg-red-50 rounded">{error}</div>;
  if (!doc) return <div className="p-8 text-gray-500">Loading document...</div>;

  const analysis = doc.analysis;

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <header>
        <Link href="/regulatory" className="text-sm text-gray-500 hover:text-black dark:hover:text-white transition">← Back to Regulatory Intelligence</Link>
        <h1 className="text-3xl font-bold tracking-tight mt-2">{doc.title}</h1>
        <div className="flex gap-3 mt-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {doc.jurisdiction || "No jurisdiction"}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
            doc.status === 'analyzed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700'
          }`}>
            {doc.status.replace('_', ' ')}
          </span>
        </div>
      </header>

      {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-900">{error}</p>}

      {!analysis ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 p-6 rounded-2xl">
          <h3 className="font-semibold text-red-800 dark:text-red-400">AI Analysis Failed or Pending</h3>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">The document was saved, but we could not extract structured data.</p>
          {busy ? (
            <div className="mt-4 flex items-center gap-3 text-red-700 dark:text-red-400">
              <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"></div>
              <p className="text-sm font-medium">{loadingMsg}</p>
            </div>
          ) : (
            <button onClick={reanalyze} className="mt-4 rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 transition">
              Retry AI Analysis
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          
          <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h2 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3">Executive Summary</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{analysis.summary}</p>
          </section>

          <div className="grid grid-cols-2 gap-6">
            <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h2 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Impact Level</h2>
              <p className={`text-3xl font-extrabold capitalize ${
                analysis.impact_level === 'high' || analysis.impact_level === 'critical' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {analysis.impact_level}
              </p>
            </section>
            <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h2 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Effective Date</h2>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{analysis.effective_date || "Unknown"}</p>
            </section>
          </div>

          <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h2 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3">Key Requirements</h2>
            <ul className="space-y-3">
              {analysis.key_requirements?.map((req: string, i: number) => (
                <li key={i} className="flex gap-3 text-gray-700 dark:text-gray-300">
                  <span className="text-blue-500 font-bold mt-0.5">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h2 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3">Affected Departments</h2>
            <div className="flex flex-wrap gap-2">
              {analysis.potentially_affected_departments?.map((dept: string) => (
                <span key={dept} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800">{dept}</span>
              ))}
              {!analysis.potentially_affected_departments?.length && <p className="text-sm text-gray-500">None identified.</p>}
            </div>
          </section>

          <section className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-sm">
            <h2 className="text-xs uppercase tracking-widest text-amber-800 dark:text-amber-500 font-bold mb-3">AI Uncertainties</h2>
            <ul className="space-y-2">
              {analysis.uncertainties?.map((u: string, i: number) => (
                <li key={i} className="flex gap-3 text-sm text-amber-900 dark:text-amber-200">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{u}</span>
                </li>
              ))}
              {!analysis.uncertainties?.length && <li className="text-sm text-amber-900 dark:text-amber-200">None identified.</li>}
            </ul>
          </section>

          <section className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-8 rounded-2xl shadow-lg mt-8">
            <h2 className="text-xl font-bold mb-2">Next Step: Assess Business Impact</h2>
            <p className="text-sm text-gray-300 dark:text-gray-600 mb-6 max-w-2xl">
              Compare this regulation against your company profile to identify affected departments and required actions.
            </p>
            {assessing ? (
              <div className="flex items-center gap-3 text-gray-300 dark:text-gray-600">
                <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"></div>
                <p className="text-sm font-medium">{loadingMsg}</p>
              </div>
            ) : (
              <button onClick={assessImpact} className="rounded-xl bg-white dark:bg-black text-black dark:text-white px-6 py-3 font-bold hover:scale-105 transition-transform">
                Run Business Impact Assessment →
              </button>
            )}
          </section>
        </div>
      )}
    </div>
  );
}