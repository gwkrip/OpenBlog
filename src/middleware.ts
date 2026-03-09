import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isApiAdmin = req.nextUrl.pathname.startsWith("/api/posts") && req.method !== "GET";
  const isLoginPage = req.nextUrl.pathname === "/login";

  if ((isAdminRoute || isApiAdmin) && !req.auth) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isLoginPage && req.auth) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
