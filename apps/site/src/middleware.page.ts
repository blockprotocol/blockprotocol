/* istanbul ignore file */
/** @see https://github.com/vercel/next.js/issues/32608#issuecomment-1007439478 about istanbul ignore file */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  isDocsVersion,
  isVersionedSection,
  LATEST_DOCS_VERSION,
} from "./lib/docs-versions";
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

/**
 * Redirects requests to `/docs` or `/spec` that are missing a version segment
 * to the latest version. E.g.:
 *   /docs                  -> /docs/<latest>
 *   /docs/blocks/develop   -> /docs/<latest>/blocks/develop
 *   /spec/graph            -> /spec/<latest>/graph
 *
 * Requests that already include a version segment (e.g. `/docs/0.3/...`) pass
 * through. Unknown version-shaped segments (e.g. `/docs/9.9/...`) also pass
 * through and will 404 at the static handler rather than redirect-loop here.
 */
const redirectToLatestVersionIfMissing = (
  url: URL,
): NextResponse | undefined => {
  const segments = url.pathname.split("/").filter((segment) => segment !== "");

  const [section, maybeVersion] = segments;

  if (!section || !isVersionedSection(section)) {
    return undefined;
  }

  if (maybeVersion && isDocsVersion(maybeVersion)) {
    return undefined;
  }

  // Don't capture anything that looks like a version we don't know about —
  // let the static handler 404 those so we don't ship surprising redirects.
  if (maybeVersion && /^\d+\.\d+$/.test(maybeVersion)) {
    return undefined;
  }

  const newUrl = new URL(url);
  const rest = segments.slice(1).join("/");
  newUrl.pathname = `/${section}/${LATEST_DOCS_VERSION}${rest ? `/${rest}` : ""}`;
  return NextResponse.redirect(newUrl, 308);
};

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

  const versionRedirect = redirectToLatestVersionIfMissing(url);
  if (versionRedirect) {
    return versionRedirect;
  }

  // if this is a /types/* page, serve JSON unless we're asked for HTML (unless it's a hardcoded type – no HTML available)
  const openingTypePage = !!url.pathname.match(versionedTypeUrlRegExp);
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
