import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase/admin";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { organizationId } = await requireSession();
    const { data: assessment, error } = await adminSupabase
      .from("impact_assessments")
      .select("*")
      .eq("id", params.id)
      .eq("organization_id", organizationId)
      .single();
    if (error || !assessment) throw new Error("Not found");

    const { data: change } = await adminSupabase
      .from("regulatory_changes")
      .select("title, summary")
      .eq("id", assessment.regulatory_change_id)
      .single();

    return NextResponse.json({ assessment, change });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 404 });
  }
}