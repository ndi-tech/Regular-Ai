import Link from "next/link";
import {
  Shield, Sparkles, FileText, CheckCircle2, ArrowRight, Zap,
  Target, Users, Building2, Lock, Scale, ChevronRight, MessageSquare
} from "lucide-react";
import FloatingThemeToggle from "./floating-theme-toggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-200 dark:selection:bg-blue-900">
      <FloatingThemeToggle />

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-40 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold">R</div>
            <span className="font-bold tracking-tight text-lg">RegulaAI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
            <a href="#problem" className="hover:text-black dark:hover:text-white transition">Problem</a>
            <a href="#how" className="hover:text-black dark:hover:text-white transition">How it Works</a>
            <a href="#who" className="hover:text-black dark:hover:text-white transition">Who it is for</a>
            <a href="#features" className="hover:text-black dark:hover:text-white transition">Features</a>
            <a href="#faq" className="hover:text-black dark:hover:text-white transition">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium hover:text-black dark:hover:text-white transition">Sign in</Link>
            <Link href="/signup" className="rounded-lg bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-semibold hover:opacity-80 transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-16 md:pt-44 md:pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 left-0 -z-10 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-100 dark:border-blue-800">
            <Sparkles size={16} />
            AI-Powered Compliance Intelligence
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
            Turn Regulatory Changes<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Into Business Action.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            RegulaAI analyzes complex regulations, determines their impact on your specific organization, and converts requirements into actionable compliance workflows. Humans stay in control at every step.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup" className="w-full sm:w-auto rounded-xl bg-black dark:bg-white text-white dark:text-black px-8 py-4 font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-black/10">
              Start Building Your Compliance Intelligence <ArrowRight size={20} />
            </Link>
            <Link href="#how" className="w-full sm:w-auto rounded-xl border-2 border-gray-200 dark:border-gray-800 px-8 py-4 font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition">
              See How It Works
            </Link>
          </div>
          <p className="text-xs text-gray-500 max-w-lg mx-auto pt-6">
            RegulaAI provides AI-assisted regulatory analysis and workflow support. It does not constitute legal advice or guarantee regulatory compliance.
          </p>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f0f] py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-gray-500 dark:text-gray-500">
          <span className="flex items-center gap-2"><Lock size={16} /> Row-Level Security</span>
          <span className="flex items-center gap-2"><Shield size={16} /> Immutable Audit Trail</span>
          <span className="flex items-center gap-2"><Scale size={16} /> Human-in-the-Loop Review</span>
          <span className="flex items-center gap-2"><Zap size={16} /> Powered by Groq</span>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">The Problem</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Compliance is broken.</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Businesses are drowning in regulatory text. A single missed clause can cost millions in fines and lost contracts.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-6">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Information overload</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Regulations are hundreds of pages of dense legal jargon. Teams spend weeks just trying to find out what applies to them.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-6">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">The cost of missing it</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Failing to comply with a new data privacy or financial law results in massive fines, reputational damage, and lost deals.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">The execution gap</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Even when a business understands a law, they lack a structured way to assign tasks, track progress, and prove they did the work.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6 bg-gray-50 dark:bg-[#0f0f0f] border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">The Solution</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">From raw PDF to completed evidence.</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">Four steps. One workflow. Every action tracked.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: "01", icon: FileText, title: "Upload regulation", desc: "Drop in a PDF, DOCX, or TXT file. AI extracts the summary, key requirements, and effective dates in seconds." },
              { n: "02", icon: Zap, title: "AI impact analysis", desc: "AI compares the regulation against your company profile to identify affected departments and processes." },
              { n: "03", icon: Users, title: "Human review", desc: "A compliance officer reviews the AI analysis and clicks Approve or Reject. Nothing ships without sign-off." },
              { n: "04", icon: CheckCircle2, title: "Action and evidence", desc: "Approved assessments become tasks. Teams upload proof. The audit trail builds itself." },
            ].map((s, i) => (
              <div key={i} className="relative bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="absolute top-4 right-4 text-4xl font-black text-gray-100 dark:text-gray-800">{s.n}</div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 relative z-10">
                  <s.icon size={20} />
                </div>
                <h3 className="text-lg font-bold mb-2 relative z-10">{s.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed relative z-10">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IS IT FOR */}
      <section id="who" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Who It Is For</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Individuals and businesses.</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">Whether you are a solo consultant or a scaling enterprise, RegulaAI adapts to your workflow.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <Users size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">For Individuals</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">Perfect for freelance compliance consultants, fractional DPOs, and solo legal advisors.</p>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /><span>Manage multiple client workspaces</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /><span>Instantly summarize 100-page legal PDFs</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /><span>Generate professional client reports</span></li>
              </ul>
              <Link href="/signup" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:gap-3 transition-all">Get started <ChevronRight size={16} /></Link>
            </div>
            <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-8 md:p-10 rounded-3xl shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-white/10 dark:bg-gray-100 text-white dark:text-gray-900 flex items-center justify-center mb-6">
                <Building2 size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">For Businesses</h3>
              <p className="text-gray-300 dark:text-gray-600 mb-6 leading-relaxed">Designed for in-house legal teams, CFOs, and operations managers at growing companies.</p>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-400 dark:text-emerald-600 shrink-0 mt-0.5" /><span>Cross-departmental task assignment</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-400 dark:text-emerald-600 shrink-0 mt-0.5" /><span>Immutable audit trails for SOC2 and ISO</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-400 dark:text-emerald-600 shrink-0 mt-0.5" /><span>Centralized evidence vault for regulators</span></li>
              </ul>
              <Link href="/signup" className="inline-flex items-center gap-2 text-sm font-bold text-white dark:text-gray-900 hover:gap-3 transition-all">Request access <ChevronRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 bg-gray-50 dark:bg-[#0f0f0f] border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need to stay compliant.</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">A complete operational platform, not just a chatbot.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: "Regulatory Intelligence", desc: "Upload any PDF or DOCX. AI extracts requirements, dates, and penalties." },
              { icon: Shield, title: "Impact Assessments", desc: "AI cross-references laws with your company profile to find affected departments." },
              { icon: CheckCircle2, title: "Action Center", desc: "A Kanban board to assign tasks, set priorities, and track progress across teams." },
              { icon: Target, title: "Evidence Vault", desc: "Securely store certificates, policies, and proof of completion in one place." },
              { icon: MessageSquare, title: "AI Copilot", desc: "Chat with your compliance data. Ask questions and get answers grounded in your documents." },
              { icon: Lock, title: "Audit Trail", desc: "Every approval, upload, and task movement is logged immutably for auditors." },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg hover:border-blue-500/50 transition-all">
                <f.icon size={24} className="text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Common questions.</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Is this a replacement for a lawyer?", a: "No. RegulaAI is an analysis and workflow assistant. It highlights requirements and impact, but every recommendation should be validated by a qualified compliance officer or legal counsel. We never declare that a company is 'compliant.'" },
              { q: "How accurate is the AI analysis?", a: "The AI reads the uploaded document itself and cross-references it against your company profile. Accuracy depends on document quality. Every assessment includes a confidence score and a list of uncertainties so reviewers know where to focus." },
              { q: "Where is my data stored?", a: "All documents, assessments, and evidence are stored in Supabase PostgreSQL with Row-Level Security. Each organization can only see its own data. Files are stored in private Supabase Storage buckets." },
              { q: "What AI model do you use?", a: "We use Groq's OpenAI-compatible inference for speed and cost-efficiency. The AI provider is abstracted, so it can be swapped for OpenAI, Anthropic, Gemini, or a self-hosted model without changing the app." },
              { q: "Can I export my compliance evidence?", a: "Yes. Every file in the Evidence Vault can be downloaded directly. The Audit Trail logs every action with timestamps, which auditors can review at any time." },
            ].map((item, i) => (
              <details key={i} className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                <summary className="flex justify-between items-center cursor-pointer list-none font-semibold">
                  {item.q}
                  <ChevronRight size={20} className="transition-transform group-open:rotate-90 text-gray-400" />
                </summary>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-[#0f0f0f] border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Ready to turn regulations into action?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">Start free. No credit card required.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup" className="w-full sm:w-auto rounded-xl bg-black dark:bg-white text-white dark:text-black px-8 py-4 font-bold text-lg hover:opacity-80 transition">
              Create Free Account
            </Link>
            <Link href="/login" className="w-full sm:w-auto rounded-xl border-2 border-gray-300 dark:border-gray-700 px-8 py-4 font-bold text-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-xs">R</div>
            <span className="font-bold">RegulaAI</span>
            <span className="text-sm text-gray-500 ml-2">by Grae-X Labs</span>
          </div>
          <p className="text-sm text-gray-500">(c) 2026 RegulaAI. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:text-black dark:hover:text-white hover:underline">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}