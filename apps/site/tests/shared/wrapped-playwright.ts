// eslint-disable-next-line no-restricted-imports
import { expect, test as base } from "playwright-test-coverage";

// eslint-disable-next-line no-restricted-imports
export * from "@playwright/test";

const tolerableSharedConsoleMessageMatches: RegExp[] = [
  /\[Fast Refresh\]/, // Next.js dev server (for local test runs)
  /Download the Apollo DevTools for a better development experience/,
  /Download the React DevTools for a better development experience/,
  // Vercel feedback script (in comment widget on preview deployments) makes 404 request for .well-known/vercel-user-meta
  /\[error] Failed to load resource: the server responded with a status of 404 \(\)/,

  // Custom responses from /api/** handlers (status codes need changing or messages need to be moved to tests' tolerateCustomConsoleMessages())
  /Failed to load resource: the server responded with a status of 400 \(Bad Request\)/,
  /Failed to load resource: the server responded with a status of 401 \(Unauthorized\)/,
  /Failed to load resource: the server responded with a status of 404 \(Not Found\)/,

  // Firefox
  /An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can remove its sandboxing/,
  /Cookie “blockprotocol-session-id” does not have a proper “SameSite” attribute value/,
  /Cookie “blockprotocol-session-id” has been rejected because it is already expired/,
  /Feature Policy: Skipping unsupported feature name “clipboard-write”/,
  /Ignoring unsupported entryTypes: largest-contentful-paint/,
  /Layout was forced before the page was fully loaded. If stylesheets are not yet loaded this may cause a flash of unstyled content/,
  /Loading failed for the <script> with source “http:\/\/localhost:\d+\/_next\/static\/chunks/,

  // Firefox - sandboxed iframe → esm.sh lodash
  /InstallTrigger is deprecated and will be removed in the future./,
  /onmozfullscreenchange is deprecated./,
  /onmozfullscreenerror is deprecated./,
];

// Messages that only show up in `yarn dev` (not CI)
if (!process.env.CI) {
  tolerableSharedConsoleMessageMatches.push(
    /Image with src "\/_next\/static\/media\/.*" was detected as the Largest Contentful Paint \(LCP\)\. Please add the "priority" property if this image is above the fold\./, // https://nextjs.org/docs/api-reference/next/legacy/image#priority
    /Warning: Each child in a list should have a unique "key" prop/,
    /Warning: Extra attributes from the server: __playwright_target__/,
    /Warning: Extra attributes from the server: ([\w%]+ )?class,tabindex/,
    /Warning: validateDOMNesting\(\.\.\.\): [\w%<>]+ cannot appear as a descendant of/,

    // Firefox
    /downloadable font: download failed \(font-family: "Inter"/,
    /downloadable font: download failed \(font-family: "JetBrains Mono"/,
  );
}

let tolerableCustomConsoleMessageMatches: RegExp[] = [];

export const tolerateCustomConsoleMessages = (
  customMatches:
    | RegExp[]
    | ((existingCustomMatches: readonly RegExp[]) => RegExp[]),
) => {
  tolerableCustomConsoleMessageMatches =
    typeof customMatches === "function"
      ? customMatches(tolerableCustomConsoleMessageMatches)
      : customMatches;
};

// eslint-disable-next-line no-restricted-imports
import type { Page } from "@playwright/test";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PageFixture = any;

/**
 * This is a wrapper around the Playwright test function that adds checks for console messages.
 * @see https://github.com/microsoft/playwright/discussions/11690#discussioncomment-2060397
 */
export const test = base.extend({
  page: (async (
    { page }: { page: Page },
    use: (page: Page) => Promise<void>,
  ) => {
    const stringifiedMessages: string[] = [];
    page.on("console", (consoleMessage) => {
      const stringifiedMessage = `[${consoleMessage.type()}] ${consoleMessage.text()}`;
      if (
        [
          ...tolerableSharedConsoleMessageMatches,
          ...tolerableCustomConsoleMessageMatches,
        ].some((match) => match.test(stringifiedMessage))
      ) {
        return;
      }
      stringifiedMessages.push(stringifiedMessage);
    });
    await use(page);
    expect(stringifiedMessages).toStrictEqual([]);
  }) as PageFixture,
});

test.beforeEach(() => {
  tolerateCustomConsoleMessages([]);
});
