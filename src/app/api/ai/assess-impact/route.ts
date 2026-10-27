import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase/admin";
import { audit } from "@/lib/audit";
import { getAIProvider } from "@/lib/ai/deepseek";
import { IMPACT_SYSTEM } from "@/lib/ai/prompts";
import { ImpactAssessmentSchema } from "@/lib/ai/schemas";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({ regulatory_change_id: z.string().uuid() });

export async function POST(req: NextRequest) {
  try {
    const { userId, organizationId } = await requireSession();
    const { regulatory_change_id } = Body.parse(await req.json());

    const { data: change, error: changeErr } = await adminSupabase
      .from("regulatory_changes")
      .select("id, title, summary, ai_analysis, document_id, regulatory_documents(raw_text, title)")
      .eq("id", regulatory_change_id)
      .eq("organization_id", organizationId)
      .single();

    if (changeErr || !change) return NextResponse.json({ error: "Change not found" }, { status: 404 });

    const { data: profile } = await adminSupabase
      .from("business_profiles")
      .select("*")
      .eq("organization_id", organizationId)
      .maybeSingle();

    if (!profile) return NextResponse.json({ error: "Business profile is incomplete. Complete onboarding first." }, { status: 422 });

    const ai = getAIProvider();
    
    // Create a concise payload for the AI
    const payload = {
      regulatory_change: {
        title: change.title,
        summary: change.summary,
        ai_analysis: change.ai_analysis,
      },
      company_profile: {
        industry: profile.industry,
        countries: profile.countries,
        business_activities: profile.business_activities,
        employee_count: profile.employee_count,
        products_services: profile.products_services,
        departments: profile.departments,
      }
    };

    const raw = await ai.complete(
      [
        { role: "system", content: IMPACT_SYSTEM },
        { role: "user", content: JSON.stringify(payload) }
      ],
      { json: true }
    );

    const parsed = JSON.parse(raw);
    const assessment = ImpactAssessmentSchema.parse(parsed);

    // Save to database
    const { data: record, error: insertErr } = await adminSupabase
      .from("impact_assessments")
      .insert({
        organization_id: organizationId,
        regulatory_change_id: change.id,
        impact_level: assessment.impact_level,
        affected_departments: assessment.affected_departments,
        affected_processes: assessment.affected_processes,
        reasoning: assessment.reasoning,
        recommended_actions: assessment.recommended_actions,
        ai_confidence: assessment.confidence,
        ai_raw: assessment,
        human_review_status: "pending",
        created_by: userId
      })
      .select()
      .single();

    if (insertErr) throw insertErr;

    await audit({ 
      organizationId, userId, 
      action: "assessment.created", 
      entityType: "impact_assessment", 
      entityId: record.id,
      metadata: { impact_level: assessment.impact_level }
    });

    return NextResponse.json({ success: true, assessment_id: record.id });
  } catch (e) {
    const msg = (e as Error).message;
    if (msg === "UNAUTHENTICATED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}