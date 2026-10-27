"use client";
import { useState, useEffect } from "react";
import { FileText, Download, FolderOpen, Calendar, Link as LinkIcon } from "lucide-react";

export default function EvidenceLibraryPage() {
  const [evidence, setEvidence] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/evidence/all")
      .then(res => res.json())
      .then(data => {
        if (data.evidence) setEvidence(data.evidence);
      })
      .finally(() => setLoading(false));
  }, []);

  // Generate public URL (assuming bucket is public - if not, we'd use a signed URL)
  const getFileUrl = (path: string) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/evidence/${path}`;
  };

  if (loading) return <div className="p-8 text-gray-500">Loading evidence library...</div>;

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Evidence Library</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          A centralized vault of all compliance proof, certificates, and documents uploaded across your tasks.
        </p>
      </header>

      {evidence.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="text-gray-400" size={32} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">No evidence yet</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
            When you complete a task in the Action Center, you can attach files as proof. They will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evidence.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg transition group flex flex-col">
              
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <FileText size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="font-semibold text-gray-900 dark:text-white truncate" title={item.file_name}>
                    {item.file_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {(item.file_size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              {item.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {item.description}
                </p>
              )}

              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <LinkIcon size={14} />
                  <span className="truncate">Task: {item.compliance_tasks?.title || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar size={14} />
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <a 
                href={getFileUrl(item.file_path)} 
                target="_blank" 
                rel="noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-2 rounded-lg text-sm font-medium transition"
              >
                <Download size={16} /> Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}