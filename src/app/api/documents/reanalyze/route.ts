import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase/admin";
import { getAIProvider } from "@/lib/ai/deepseek";
import { DOC_ANALYSIS_SYSTEM } from "@/lib/ai/prompts";
import { DocumentAnalysisSchema } from "@/lib/ai/schemas";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { organizationId } = await requireSession();
    const { documentId } = await req.json();

    const { data: doc, error: docErr } = await adminSupabase
      .from("regulatory_documents")
      .select("id, title, raw_text")
      .eq("id", documentId)
      .eq("organization_id", organizationId)
      .single();

    if (docErr || !doc) throw new Error("Document not found");
    if (!doc.raw_text) throw new Error("No text extracted from this document");

    const ai = getAIProvider();
    const safeText = doc.raw_text.slice(0, 15000);

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
      title: `${doc.title} — update`, summary: analysis.summary,
      change_type: "regulatory_update", effective_date: analysis.effective_date || null,
      ai_analysis: analysis,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}