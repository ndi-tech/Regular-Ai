import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase/admin";
import { audit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const { userId, organizationId } = await requireSession();
    const body = await req.json();
    
    const { data: task, error } = await adminSupabase
      .from("compliance_tasks")
      .insert({
        organization_id: organizationId,
        impact_assessment_id: body.assessment_id || null,
        title: body.title,
        description: body.description,
        department: body.department,
        priority: body.priority || "medium",
        status: "not_started",
        due_date: body.due_date || null,
        created_by: userId,
      })
      .select().single();

    if (error) throw error;
    
    await audit({ organizationId, userId, action: "task.created", entityType: "compliance_task", entityId: task.id, metadata: { title: task.title } });
    
    return NextResponse.json({ task });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}