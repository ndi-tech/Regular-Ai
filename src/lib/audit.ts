import { adminSupabase } from "./supabase/admin";
export async function audit(params: {
  organizationId: string; userId: string | null;
  action: string; entityType?: string; entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  await adminSupabase.from("audit_logs").insert({
    organization_id: params.organizationId,
    user_id: params.userId,
    action: params.action,
    entity_type: params.entityType ?? null,
    entity_id: params.entityId ?? null,
    metadata: params.metadata ?? {},
  });
}