import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase/admin";
import { audit } from "@/lib/audit";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId, organizationId } = await requireSession();
    const { status } = await req.json();
    
    if (!["not_started", "in_progress", "blocked", "completed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updateData: any = { status };
    if (status === "completed") updateData.completed_at = new Date().toISOString();
    else updateData.completed_at = null;

    const { data: task, error } = await adminSupabase
      .from("compliance_tasks")
      .update(updateData)
      .eq("id", params.id)
      .eq("organization_id", organizationId)
      .select().single();

    if (error) throw error;
    
    await audit({ organizationId, userId, action: `task.${status}`, entityType: "compliance_task", entityId: task.id });
    
    return NextResponse.json({ task });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}