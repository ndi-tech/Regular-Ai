import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: { headers: req.headers } });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (n) => req.cookies.get(n)?.value,
        set: (n, v, o) => res.cookies.set({ name: n, value: v, ...o }),
        remove: (n, o) => res.cookies.set({ name: n, value: "", ...o }),
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  const p = req.nextUrl.pathname;
  const isAuth = p.startsWith("/login") || p.startsWith("/signup");
  const isProtected =
    ["/dashboard","/regulatory","/assessments","/tasks","/evidence",
     "/copilot","/audit","/organization","/settings","/onboarding"]
    .some((x) => p.startsWith(x));

  if (!user && isProtected) return NextResponse.redirect(new URL("/login", req.url));
  if (user && isAuth) return NextResponse.redirect(new URL("/dashboard", req.url));
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};