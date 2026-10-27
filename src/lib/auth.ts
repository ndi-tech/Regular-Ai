import "server-only";
import { createServerSupabase } from "./supabase/server";

export type SessionContext = {
  userId: string; organizationId: string; profileId: string; role: string;
};

export async function requireSession(): Promise<SessionContext> {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  const { data: profile, error } = await supabase
    .from("profiles").select("id, organization_id, role")
    .eq("user_id", user.id).single();
  if (error || !profile?.organization_id) throw new Error("NO_ORGANIZATION");
  return {
    userId: user.id,
    organizationId: profile.organization_id,
    profileId: profile.id,
    role: profile.role,
  };
}