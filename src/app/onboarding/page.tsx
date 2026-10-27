"use client";
import { useState } from "react";

const INDUSTRIES = ["Financial Services","Healthcare","Manufacturing","Retail",
  "Logistics","Technology","Professional Services","Energy","Insurance","Other"];

const COMPLIANCE_AREAS = ["Data Protection","Finance","Employment","Environmental",
  "Healthcare","Consumer Protection","Taxation","Industry-Specific"];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [country, setCountry] = useState("");
  const [operatingCountries, setOperatingCountries] = useState("");

  const [activities, setActivities] = useState("");
  const [products, setProducts] = useState("");
  const [employeeCount, setEmployeeCount] = useState("1-10");
  const [departments, setDepartments] = useState("");

  const [areas, setAreas] = useState<string[]>([]);

  function toggleArea(a: string) {
    setAreas((p) => p.includes(a) ? p.filter(x => x !== a) : [...p, a]);
  }

  async function finish() {
    setBusy(true); setError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName, industry, country, operatingCountries,
          activities, products, employeeCount, departments, areas
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create workspace");

      window.location.href = "/dashboard";
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen max-w-2xl mx-auto p-6 space-y-6 bg-gray-50">
      <header className="pt-8">
        <h1 className="text-3xl font-semibold tracking-tight">Set up your workspace</h1>
        <p className="text-sm text-gray-600 mt-1">Step {step} of 3</p>
      </header>

      {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>}

      {step === 1 && (
        <div className="space-y-3 bg-white p-6 rounded-lg border">
          <h2 className="font-medium text-lg">Company</h2>
          <input className="w-full rounded border p-3" placeholder="Company name"
            value={companyName} onChange={e => setCompanyName(e.target.value)} />
          <select className="w-full rounded border p-3" value={industry}
            onChange={e => setIndustry(e.target.value)}>
            {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
          </select>
          <input className="w-full rounded border p-3" placeholder="Headquarters country"
            value={country} onChange={e => setCountry(e.target.value)} />
          <input className="w-full rounded border p-3"
            placeholder="Operating countries (comma-separated)"
            value={operatingCountries} onChange={e => setOperatingCountries(e.target.value)} />
          <button disabled={!companyName || !country}
            onClick={() => setStep(2)}
            className="rounded bg-black text-white px-5 py-3 font-medium disabled:opacity-50">
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3 bg-white p-6 rounded-lg border">
          <h2 className="font-medium text-lg">Business</h2>
          <input className="w-full rounded border p-3" placeholder="Business activities (comma-separated)"
            value={activities} onChange={e => setActivities(e.target.value)} />
          <input className="w-full rounded border p-3" placeholder="Products / services"
            value={products} onChange={e => setProducts(e.target.value)} />
          <select className="w-full rounded border p-3" value={employeeCount}
            onChange={e => setEmployeeCount(e.target.value)}>
            {["1-10","11-50","51-200","201-1000","1000+"].map(o => <option key={o}>{o}</option>)}
          </select>
          <input className="w-full rounded border p-3" placeholder="Departments (comma-separated)"
            value={departments} onChange={e => setDepartments(e.target.value)} />
          <div className="flex gap-2 pt-2">
            <button onClick={() => setStep(1)} className="rounded border px-5 py-3">Back</button>
            <button onClick={() => setStep(3)} className="rounded bg-black text-white px-5 py-3 font-medium">Continue</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3 bg-white p-6 rounded-lg border">
          <h2 className="font-medium text-lg">Compliance context</h2>
          <p className="text-sm text-gray-600">Select areas relevant to your business.</p>
          <div className="grid grid-cols-2 gap-2">
            {COMPLIANCE_AREAS.map(a => (
              <button key={a} type="button" onClick={() => toggleArea(a)}
                className={`rounded border p-3 text-left text-sm ${areas.includes(a) ? "border-black bg-gray-100 font-medium" : ""}`}>
                {a}
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setStep(2)} className="rounded border px-5 py-3">Back</button>
            <button disabled={busy || areas.length === 0} onClick={finish}
              className="rounded bg-black text-white px-5 py-3 font-medium disabled:opacity-50">
              {busy ? "Creating workspace…" : "Finish setup"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}