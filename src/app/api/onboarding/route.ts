import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { adminSupabase } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const body = await req.json();
    const { companyName, industry, country, operatingCountries, activities, products, employeeCount, departments, areas } = body;

    // 1. Create the organization
    const { data: org, error: orgErr } = await adminSupabase
      .from("organizations").insert({ name: companyName, industry, country }).select("id").single();
    if (orgErr) throw orgErr;

    // 2. Update the profile (using admin client to bypass any RLS hiccups)
    const { error: profErr } = await adminSupabase
      .from("profiles").update({ organization_id: org.id }).eq("user_id", user.id);
    if (profErr) throw profErr;

    // 3. Create the business profile
    const { error: bpErr } = await adminSupabase
      .from("business_profiles").insert({
        organization_id: org.id, industry,
        countries: operatingCountries.split(",").map((s: string) => s.trim()).filter(Boolean),
        business_activities: activities.split(",").map((s: string) => s.trim()).filter(Boolean),
        employee_count: employeeCount, products_services: products,
        compliance_areas: areas,
        departments: departments.split(",").map((s: string) => s.trim()).filter(Boolean),
      });
    if (bpErr) throw bpErr;

    return NextResponse.json({ success: true, organization_id: org.id });
  } catch (e) {
    console.error("Onboarding API Error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}