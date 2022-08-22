import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { cookies } = request;

  // destroying session at `logout.api.ts` removes this cookie
  const isLoggedIn = !!cookies.get("blockprotocol-session-id");

  if (isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}

export const config = {
  // only redirect on homepage
  matcher: "/",
};
