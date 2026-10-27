import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase/admin";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { userId, organizationId } = await requireSession();
    const form = await req.formData();
    
    const file = form.get("file") as File | null;
    const taskId = form.get("task_id") as string;
    const description = form.get("description") as string;

    if (!file || !taskId) return NextResponse.json({ error: "File and task ID required" }, { status: 400 });

    // Upload to Supabase Storage
    const path = `${organizationId}/${taskId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { error: upErr } = await adminSupabase.storage.from("evidence").upload(path, file, { contentType: file.type });
    if (upErr) throw new Error(upErr.message);

    // Save record in DB
    const { data: evidence, error: dbErr } = await adminSupabase
      .from("evidence")
      .insert({
        organization_id: organizationId,
        task_id: taskId,
        file_path: path,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        description: description || null,
        uploaded_by: userId
      })
      .select().single();

    if (dbErr) {
      await adminSupabase.storage.from("evidence").remove([path]); // rollback file
      throw dbErr;
    }

    await audit({ organizationId, userId, action: "evidence.uploaded", entityType: "evidence", entityId: evidence.id, metadata: { task_id: taskId, file_name: file.name } });

    return NextResponse.json({ evidence });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}