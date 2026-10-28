import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  
  // Where to redirect the user after a successful login
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // If they don't have an org yet, the layout middleware will handle sending them to /onboarding
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, send them back to login with an error
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate with Google`);
}