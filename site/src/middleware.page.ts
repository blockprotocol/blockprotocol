/* istanbul ignore file */
/** @see https://github.com/vercel/next.js/issues/32608#issuecomment-1007439478 about istanbul ignore file */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "./lib/api/middleware/constants";

const productionHost = "blockprotocol.org";
const productionSandboxHost = "www.blocksandbox.org";

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const openingBlockSandboxPage = url.pathname.endsWith("/sandboxed-demo");

  if (url.host === productionHost && openingBlockSandboxPage) {
    const newUrl = new URL(url);
    newUrl.host = productionSandboxHost;
    return NextResponse.redirect(newUrl);
  }

  if (url.host === productionSandboxHost && !openingBlockSandboxPage) {
    const newUrl = new URL(url);
    newUrl.host = productionHost;
    return NextResponse.redirect(newUrl);
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
