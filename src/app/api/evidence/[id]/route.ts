import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase/admin";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { organizationId } = await requireSession();
    const { data: evidence } = await adminSupabase
      .from("evidence")
      .select("*")
      .eq("task_id", params.id)
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });
    return NextResponse.json({ evidence: evidence || [] });
  } catch (e) {
    return NextResponse.json({ evidence: [] });
  }
}