import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { adminSupabase } from "@/lib/supabase/admin";

export async function DELETE() {
  try {
    // 1. Get the current user's session
    const supabase = createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { organizationId } = await requireSession();

    // 2. Delete the organization (CASCADE will delete profiles, docs, tasks, etc.)
    // Because the profiles table has ON DELETE SET NULL for organization_id, 
    // deleting the org will unlink the user. Then we delete the auth user.
    await adminSupabase.from("organizations").delete().eq("id", organizationId);

    // 3. Delete the auth user using the service role key
    const { error } = await adminSupabase.auth.admin.deleteUser(user.id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Delete Account Error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}