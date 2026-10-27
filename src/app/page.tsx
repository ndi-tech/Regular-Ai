import Link from "next/link";
import { Shield, Sparkles, FileText, CheckCircle2, ArrowRight, Zap, Target, Users, Building2 } from "lucide-react";
import FloatingThemeToggle from "./floating-theme-toggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-200 dark:selection:bg-blue-900">
      
      {/* Floating Theme Toggle */}
      <FloatingThemeToggle />
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold">R</div>
            <span className="font-bold tracking-tight text-lg">RegulaAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
            <a href="#problem" className="hover:text-black dark:hover:text-white transition">Problem</a>
            <a href="#how-it-works" className="hover:text-black dark:hover:text-white transition">How it Works</a>
            <a href="#features" className="hover:text-black dark:hover:text-white transition">Features</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium hover:text-black dark:hover:text-white transition">Sign in</Link>
            <Link href="/signup" className="rounded-lg bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-semibold hover:opacity-80 transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 left-0 -z-10 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-100 dark:border-blue-800">
            <Sparkles size={16} /> AI-Powered Compliance Intelligence
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Turn Regulatory Changes<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Into Business Action.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            RegulaAI analyzes complex regulations, determines their impact on your specific organization, and converts requirements into actionable compliance workflows â€” with humans always in control.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup" className="w-full sm:w-auto rounded-xl bg-black dark:bg-white text-white dark:text-black px-8 py-4 font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
              Start Building Your Compliance Intelligence <ArrowRight size={20} />
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto rounded-xl border-2 border-gray-200 dark:border-gray-800 px-8 py-4 font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition">
              See How It Works
            </Link>
          </div>
          <p className="text-xs text-gray-500 max-w-lg mx-auto pt-8">
            RegulaAI provides AI-assisted regulatory analysis and workflow support. It does not constitute legal advice or guarantee regulatory compliance.
          </p>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section id="problem" className="py-24 bg-gray-50 dark:bg-[#0f0f0f] px-6 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Compliance is Broken.</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Businesses are drowning in regulatory text, and the risk of missing a single clause can cost millions.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Information Overload", desc: "Regulations are hundreds of pages of dense legal jargon. Teams spend weeks just trying to find out what applies to them." },
              { title: "The Cost of Missing It", desc: "Failing to comply with a new data privacy or financial law results in massive fines, reputational damage, and lost contracts." },
              { title: "The Execution Gap", desc: "Even when a business understands a law, they lack a structured way to assign tasks, track progress, and prove they actually did the work." }
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-6">
                  <Target size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How RegulaAI Solves It</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              From raw PDF to completed evidence in four simple steps.
            </p>
          </div>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-800 before:to-transparent">
            
            {[
              { step: "01", title: "Upload Regulation", desc: "Drop in a PDF, DOCX, or TXT file. Our AI extracts the summary, key requirements, and effective dates in seconds.", icon: FileText },
              { step: "02", title: "AI Impact Assessment", desc: "The AI compares the regulation against your company profile to identify exactly which departments and processes are affected.", icon: Zap },
              { step: "03", title: "Human Review", desc: "Nothing happens automatically. A compliance officer reviews the AI's analysis and clicks 'Approve' or 'Reject'.", icon: Users },
              { step: "04", title: "Action & Evidence", desc: "Approved assessments become tasks. Teams upload proof of completion into the Evidence vault, building an unbreakable audit trail.", icon: CheckCircle2 },
            ].map((item, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#0a0a0a] bg-gray-900 dark:bg-white text-white dark:text-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <item.icon size={16} />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">STEP {item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IS IT FOR */}
      <section className="py-24 bg-gray-50 dark:bg-[#0f0f0f] px-6 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Built for Individuals and Businesses</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Whether you are an independent consultant or a large enterprise, RegulaAI scales to your needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Individuals */}
            <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Users size={120} /></div>
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <Users size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">For Individuals</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Perfect for freelance compliance consultants, fractional DPOs, and solo legal advisors.</p>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Manage multiple client workspaces</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Instantly summarize 100-page legal PDFs</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Generate professional client reports</li>
              </ul>
            </div>

            {/* For Businesses */}
            <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-8 md:p-10 rounded-3xl border border-gray-800 dark:border-gray-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Building2 size={120} /></div>
              <div className="w-14 h-14 rounded-2xl bg-white/10 dark:bg-gray-100 text-white dark:text-gray-900 flex items-center justify-center mb-6">
                <Building2 size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">For Businesses</h3>
              <p className="text-gray-300 dark:text-gray-600 mb-6">Designed for in-house legal teams, CFOs, and operations managers at growing companies.</p>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400 dark:text-emerald-600" /> Cross-departmental task assignment</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400 dark:text-emerald-600" /> Immutable audit trails for SOC2 / ISO</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400 dark:text-emerald-600" /> Centralized evidence vault for regulators</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need to stay compliant</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              A complete operational platform, not just a chatbot.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: "Regulatory Intelligence", desc: "Upload any PDF/DOCX and let the AI extract requirements, dates, and penalties." },
              { icon: Shield, title: "Impact Assessments", desc: "AI cross-references laws with your company profile to find affected departments." },
              { icon: CheckCircle2, title: "Action Center", desc: "A Kanban board to assign tasks, set priorities, and track progress across teams." },
              { icon: Target, title: "Evidence Vault", desc: "Securely upload and store certificates, policies, and proof of completion." },
              { icon: Sparkles, title: "AI Copilot", desc: "Chat with your compliance data. Ask 'What are my high-risk tasks?' and get answers." },
              { icon: Shield, title: "Audit Trail", desc: "Every approval, upload, and task movement is logged immutably for auditors." },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow">
                <item.icon size={24} className="text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-[#0f0f0f] border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Ready to turn regulations into action?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">Join the future of compliance intelligence today.</p>
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
          </div>
          <p className="text-sm text-gray-500">Â© 2026 RegulaAI. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:text-black dark:hover:text-white hover:underline">Terms</a>
          </div>
        </div>
      </footer>

    </div>
  );
}