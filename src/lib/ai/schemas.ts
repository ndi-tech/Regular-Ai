import { z } from "zod";

export const DocumentAnalysisSchema = z.object({
  summary: z.string(),
  key_requirements: z.array(z.string()).default([]),
  changes: z.array(z.string()).default([]),
  effective_date: z.string().nullable().optional(),
  potentially_affected_departments: z.array(z.string()).default([]),
  potentially_affected_processes: z.array(z.string()).default([]),
  impact_level: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  recommended_actions: z.array(z.string()).default([]),
  uncertainties: z.array(z.string()).default([]),
  source_references: z.array(z.string()).default([]),
});
export type DocumentAnalysis = z.infer<typeof DocumentAnalysisSchema>;

export const ImpactAssessmentSchema = z.object({
  impact_level: z.enum(["low", "medium", "high", "critical"]),
  affected_departments: z.array(z.string()).default([]),
  affected_processes: z.array(z.string()).default([]),
  reasoning: z.string(),
  recommended_actions: z.array(z.string()).default([]),
  uncertainties: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1).default(0.6),
});
export type ImpactAssessment = z.infer<typeof ImpactAssessmentSchema>;