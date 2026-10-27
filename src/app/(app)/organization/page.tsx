"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function OrganizationPage() {
  const [profile, setProfile] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  
  const [form, setForm] = useState({
    industry: "",
    countries: "",
    employee_count: "",
    business_activities: "",
    products_services: "",
    departments: "",
    compliance_areas: ""
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: prof } = await supabase
        .from("profiles")
        .select("organization_id, organizations(name, country)")
        .eq("user_id", user.id)
        .single();
        
      if (prof) {
        const { data: bp } = await supabase
          .from("business_profiles")
          .select("*")
          .eq("organization_id", prof.organization_id)
          .maybeSingle();

        setProfile({ ...prof, orgName: (prof as any).organizations?.name });
        
        if (bp) {
          setForm({
            industry: bp.industry || "",
            countries: (bp.countries || []).join(", "),
            employee_count: bp.employee_count || "",
            business_activities: (bp.business_activities || []).join(", "),
            products_services: bp.products_services || "",
            departments: (bp.departments || []).join(", "),
            compliance_areas: (bp.compliance_areas || []).join(", ")
          });
        }
      }
    }
    load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("business_profiles")
        .update({
          industry: form.industry,
          countries: form.countries.split(",").map(s => s.trim()).filter(Boolean),
          employee_count: form.employee_count,
          business_activities: form.business_activities.split(",").map(s => s.trim()).filter(Boolean),
          products_services: form.products_services,
          departments: form.departments.split(",").map(s => s.trim()).filter(Boolean),
          compliance_areas: form.compliance_areas.split(",").map(s => s.trim()).filter(Boolean)
        })
        .eq("organization_id", profile.organization_id);

      if (error) throw error;
      setMessage("Profile updated successfully!");
    } catch (e) {
      setMessage(`Error: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  if (!profile) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-8 max-w-2xl pb-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Organization Profile</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Update your business details. The AI uses this data to assess the impact of regulations.
        </p>
      </header>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={save} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1">Company Name</label>
          <input disabled value={profile.orgName || ""} className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-800 text-gray-500" />
          <p className="text-xs text-gray-500 mt-1">Company name cannot be changed here.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Industry</label>
            <input value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} className="w-full rounded-lg border p-3" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Employee Count</label>
            <select value={form.employee_count} onChange={e => setForm({...form, employee_count: e.target.value})} className="w-full rounded-lg border p-3">
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-1000">201-1000</option>
              <option value="1000+">1000+</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Operating Countries</label>
          <input value={form.countries} onChange={e => setForm({...form, countries: e.target.value})} placeholder="Comma-separated" className="w-full rounded-lg border p-3" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Business Activities</label>
          <input value={form.business_activities} onChange={e => setForm({...form, business_activities: e.target.value})} placeholder="Comma-separated" className="w-full rounded-lg border p-3" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Products / Services</label>
          <textarea value={form.products_services} onChange={e => setForm({...form, products_services: e.target.value})} rows={2} className="w-full rounded-lg border p-3" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Departments</label>
          <input value={form.departments} onChange={e => setForm({...form, departments: e.target.value})} placeholder="Comma-separated" className="w-full rounded-lg border p-3" />
        </div>

        <button disabled={busy} type="submit" className="w-full rounded-lg bg-black dark:bg-white text-white dark:text-black py-3 font-semibold hover:opacity-80 transition">
          {busy ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}