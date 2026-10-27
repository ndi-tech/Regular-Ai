import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { organizationId } = await requireSession();
    const { data: evidence } = await adminSupabase
      .from("evidence")
      .select(`
        *,
        compliance_tasks (title)
      `)
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });
      
    return NextResponse.json({ evidence: evidence || [] });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}