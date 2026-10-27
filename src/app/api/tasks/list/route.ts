import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { organizationId } = await requireSession();
    const { data: tasks } = await adminSupabase
      .from("compliance_tasks")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });
    return NextResponse.json({ tasks: tasks || [] });
  } catch (e) {
    return NextResponse.json({ tasks: [] });
  }
}