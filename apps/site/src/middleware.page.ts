/* istanbul ignore file */
/** @see https://github.com/vercel/next.js/issues/32608#issuecomment-1007439478 about istanbul ignore file */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { hardcodedTypes } from "./middleware.page/hardcoded-types";
import {
  returnTypeAsJson,
  versionedTypeUrlRegExp,
} from "./middleware.page/return-types-as-json";

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
      url.pathname.match(/^\/@[\w_-]+\/blocks\/[\w_-]+\/sandboxed-demo(\/?)$/),
    );

    if (url.host === productionFrontendHost && openingBlockSandboxPage) {
      return changeHostAndRedirect(productionSandboxHost);
    }

    if (url.host === productionSandboxHost && !openingBlockSandboxPage) {
      return changeHostAndRedirect(productionFrontendHost);
    }
  }

  // if this is a /types/* page, serve JSON unless we're asked for HTML (unless it's a hardcoded type – no HTML available)
  const openingTypePage = Boolean(url.pathname.match(versionedTypeUrlRegExp));
  const htmlRequested = request.headers.get("accept")?.includes("text/html");
  const isHardedCodedType =
    url.href.replace(url.origin, "https://blockprotocol.org") in hardcodedTypes;

  if (openingTypePage && (!htmlRequested || isHardedCodedType)) {
    return returnTypeAsJson(request);
  }
}

/**
 * Exclude API routes from the middleware as it stops them accessing the raw body (needed for file uploads)
 * @see https://github.com/vercel/next.js/issues/39262
 */
export const config = {
  matcher: ["/", "/((?!api/).*)"],
};
