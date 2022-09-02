/* istanbul ignore file */
/** @see https://github.com/vercel/next.js/issues/32608#issuecomment-1007439478 about istanbul ignore file */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "./lib/api/middleware/constants";

const productionFrontendHost = process.env.NEXT_PUBLIC_FRONTEND_URL
  ? new URL(process.env.NEXT_PUBLIC_FRONTEND_URL).host
  : undefined;
const productionSandboxHost = process.env.NEXT_PUBLIC_BLOCK_SANDBOX_URL
  ? new URL(process.env.NEXT_PUBLIC_BLOCK_SANDBOX_URL).host
  : undefined;

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);

  if (productionFrontendHost && productionSandboxHost) {
    const changeHostAndRedirect = (newHost: string) => {
      const newUrl = new URL(url);
      newUrl.host = newHost;
      return NextResponse.redirect(newUrl, 308);
    };

    const openingBlockSandboxPage = Boolean(
      url.pathname.match(/^\/@[\w_-]+\/blocks\/[\w_-]+\/sandboxed-demo$/),
    );

    if (url.host === productionFrontendHost && openingBlockSandboxPage) {
      return changeHostAndRedirect(productionSandboxHost);
    }

    if (url.host === productionSandboxHost && !openingBlockSandboxPage) {
      return changeHostAndRedirect(productionFrontendHost);
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
