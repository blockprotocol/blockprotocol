/* istanbul ignore file */
/** @see https://github.com/vercel/next.js/issues/32608#issuecomment-1007439478 about istanbul ignore file */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "./lib/api/middleware/constants";

const productionFrontendHost = process.env.NEXT_PUBLIC_FRONTEND_URL;
const productionSandboxHost = process.env.NEXT_PUBLIC_BLOCK_SANDBOX_URL;

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);

  if (productionFrontendHost && productionSandboxHost) {
    const openingBlockSandboxPage = url.pathname.endsWith("/sandboxed-demo");

    if (url.host === productionFrontendHost && openingBlockSandboxPage) {
      const newUrl = new URL(url);
      newUrl.host = productionSandboxHost;
      return NextResponse.redirect(newUrl);
    }

    if (url.host === productionSandboxHost && !openingBlockSandboxPage) {
      const newUrl = new URL(url);
      newUrl.host = productionFrontendHost;
      return NextResponse.redirect(newUrl);
    }
  }

  if (url.pathname === "/") {
    const { cookies } = request;

    // destroying session at `logout.api.ts` removes this cookie
    const isLoggedIn = !!cookies.get(SESSION_COOKIE_NAME);

    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
}
