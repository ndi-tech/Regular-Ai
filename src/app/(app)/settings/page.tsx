"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");

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
          RegulaAI v0.1.0 — Turn regulatory changes into business action.<br/>
          <span className="text-xs text-gray-500 mt-2 block">RegulaAI provides AI-assisted regulatory analysis and workflow support. It does not constitute legal advice or guarantee regulatory compliance.</span>
        </p>
      </section>
    </div>
  );
}