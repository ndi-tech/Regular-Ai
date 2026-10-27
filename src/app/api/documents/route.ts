import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase/admin";
import { audit } from "@/lib/audit";
import { extractText, ALLOWED_MIME, MAX_FILE_SIZE } from "@/lib/documents";
import { getAIProvider } from "@/lib/ai/deepseek";
import { DOC_ANALYSIS_SYSTEM } from "@/lib/ai/prompts";
import { DocumentAnalysisSchema } from "@/lib/ai/schemas";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { userId, organizationId } = await requireSession();
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const title = (form.get("title") as string)?.trim();
    const jurisdiction = (form.get("jurisdiction") as string) || null;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (!ALLOWED_MIME.has(file.type)) return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "File too large (max 15MB)" }, { status: 400 });

    const path = `${organizationId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { error: upErr } = await adminSupabase.storage.from("regulatory-documents").upload(path, file, { contentType: file.type });
    if (upErr) return NextResponse.json({ error: `Storage error: ${upErr.message}` }, { status: 500 });

    let rawText = "";
    try {
      rawText = await extractText(file);
    } catch (e) {
      await adminSupabase.storage.from("regulatory-documents").remove([path]);
      return NextResponse.json({ error: `Text extraction failed: ${(e as Error).message}` }, { status: 422 });
    }

    const { data: doc, error: docErr } = await adminSupabase
      .from("regulatory_documents")
      .insert({ organization_id: organizationId, title, jurisdiction, document_path: path, status: "analyzing", raw_text: rawText, uploaded_by: userId })
      .select().single();
    if (docErr || !doc) return NextResponse.json({ error: docErr?.message }, { status: 500 });

    await audit({ organizationId, userId, action: "document.uploaded", entityType: "regulatory_document", entityId: doc.id, metadata: { title } });

    try {
      const ai = getAIProvider();
      // LIMIT TO ~15,000 CHARACTERS FOR GROQ FREE TIER
      const safeText = rawText.slice(0, 15000);
      
      const raw = await ai.complete(
        [{ role: "system", content: DOC_ANALYSIS_SYSTEM },
         { role: "user", content: `Analyze this regulatory document:\n\n${safeText}` }],
        { json: true }
      );
      
      const parsed = JSON.parse(raw);
      const analysis = DocumentAnalysisSchema.parse(parsed);

      await adminSupabase.from("regulatory_documents").update({ analysis, status: "analyzed" }).eq("id", doc.id);
      
      await adminSupabase.from("regulatory_changes").insert({
        document_id: doc.id, organization_id: organizationId,
        title: `${title} — update`, summary: analysis.summary,
        change_type: "regulatory_update", effective_date: analysis.effective_date || null,
        ai_analysis: analysis,
      });

      await audit({ organizationId, userId, action: "ai.analysis_created", entityType: "regulatory_document", entityId: doc.id });
    } catch (aiErr) {
      await adminSupabase.from("regulatory_documents").update({ status: "analysis_failed" }).eq("id", doc.id);
      return NextResponse.json({ document: doc, warning: `Document saved, but AI failed: ${(aiErr as Error).message}` }, { status: 200 });
    }

    return NextResponse.json({ document: { ...doc, status: "analyzed" } });
  } catch (e) {
    const msg = (e as Error).message;
    if (msg === "UNAUTHENTICATED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}