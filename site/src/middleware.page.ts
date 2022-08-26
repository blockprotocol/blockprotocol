/* istanbul ignore file */
/** @see https://github.com/vercel/next.js/issues/32608#issuecomment-1007439478 about istanbul ignore file */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "./lib/api/middleware/constants";

export async function middleware(request: NextRequest) {
  const { cookies } = request;

  // destroying session at `logout.api.ts` removes this cookie
  const isLoggedIn = !!cookies.get(SESSION_COOKIE_NAME);

  if (isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}

export const config = {
  // only redirect on homepage
  matcher: "/",
};
