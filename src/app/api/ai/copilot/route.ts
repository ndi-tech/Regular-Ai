import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase/admin";
import { getAIProvider } from "@/lib/ai/deepseek";
import { COPILOT_SYSTEM } from "@/lib/ai/prompts";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { organizationId } = await requireSession();
    const { messages } = await req.json();

    // 1. Fetch the user's actual data to give the AI context
    const { data: docs } = await adminSupabase
      .from("regulatory_documents")
      .select("title, analysis")
      .eq("organization_id", organizationId)
      .eq("status", "analyzed")
      .limit(5);

    const { data: assessments } = await adminSupabase
      .from("impact_assessments")
      .select("impact_level, human_review_status, reasoning, affected_departments")
      .eq("organization_id", organizationId)
      .limit(5);

    const { data: tasks } = await adminSupabase
      .from("compliance_tasks")
      .select("title, status, department, priority")
      .eq("organization_id", organizationId)
      .limit(10);

    // 2. Build the context string
    let context = "--- ORGANIZATION DATA ---\n";
    if (docs?.length) {
      context += "DOCUMENTS:\n" + docs.map(d => `- ${d.title}: ${d.analysis?.summary || "No summary"}`).join("\n") + "\n";
    }
    if (assessments?.length) {
      context += "ASSESSMENTS:\n" + assessments.map(a => `- Impact: ${a.impact_level}, Status: ${a.human_review_status}, Depts: ${a.affected_departments?.join(", ")}. Reasoning: ${a.reasoning}`).join("\n") + "\n";
    }
    if (tasks?.length) {
      context += "TASKS:\n" + tasks.map(t => `- ${t.title} (${t.status}, ${t.priority})`).join("\n") + "\n";
    }
    context += "--- END DATA ---";

    // 3. Format messages for the AI
    const aiMessages = [
      { role: "system", content: COPILOT_SYSTEM },
      { role: "system", content: context },
      ...messages
    ];

    // 4. Call Groq
    const ai = getAIProvider();
    // We don't force JSON here because we want a natural text response
    const responseText = await ai.complete(aiMessages as any, { json: false });

    return NextResponse.json({ message: responseText });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}