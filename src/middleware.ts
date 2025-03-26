import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NextURL } from "next/dist/server/web/next-url";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  if (!token) {
    if (pathname !== "/login") {
      const loginUrl = new NextURL("/login", origin);
      return NextResponse.redirect(loginUrl);
    }
  } else {
    if (pathname === "/login") {
      const dashboardUrl = new NextURL("/", origin);
      return NextResponse.redirect(dashboardUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login"],
};
