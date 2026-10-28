import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

async function handleLogout(req: Request) {
  const supabase = createServerSupabase();
  await supabase.auth.signOut();
  
  // Force a redirect to the landing page using the request's origin
  const url = new URL("/", req.url);
  return NextResponse.redirect(url);
}

export async function GET(req: Request) { return handleLogout(req); }
export async function POST(req: Request) { return handleLogout(req); }