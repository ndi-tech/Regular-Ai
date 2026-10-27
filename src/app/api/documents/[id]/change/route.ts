import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase/admin";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { organizationId } = await requireSession();
    const { data: change, error } = await adminSupabase
      .from("regulatory_changes")
      .select("id, title, summary")
      .eq("document_id", params.id)
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return NextResponse.json({ change });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message, change: null }, { status: 200 });
  }
}