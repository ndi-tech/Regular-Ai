import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase/admin";
import { audit } from "@/lib/audit";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId, organizationId } = await requireSession();
    const { decision, note } = await req.json();

    if (!["approved", "rejected"].includes(decision)) {
      return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
    }

    const { data: updated, error } = await adminSupabase
      .from("impact_assessments")
      .update({
        human_review_status: decision,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
        review_notes: note || null
      })
      .eq("id", params.id)
      .eq("organization_id", organizationId)
      .select()
      .single();

    if (error || !updated) throw new Error(error?.message || "Update failed");

    await audit({
      organizationId, userId,
      action: `assessment.${decision}`,
      entityType: "impact_assessment", entityId: params.id,
      metadata: { note: note || null }
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}