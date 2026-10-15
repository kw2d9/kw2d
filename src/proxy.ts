import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Keeps the admin's Supabase session fresh and keeps admin responses out of caches and search. */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(list) {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    const { data } = await supabase.auth.getUser();
    const isAdmin = data.user?.app_metadata?.role === "admin";
    const { pathname } = request.nextUrl;

    // First line of defence. Pages, actions and routes each re-check on their own.
    if (!isAdmin && pathname !== "/admin/login") {
      if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const login = new URL("/admin/login", request.url);
      const redirect = NextResponse.redirect(login);
      response.cookies.getAll().forEach((c) => redirect.cookies.set(c)); // keep any refreshed/cleared auth cookies
      redirect.headers.set("Cache-Control", "private, no-store");
      return redirect;
    }
  } else if (request.nextUrl.pathname !== "/admin/login") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
