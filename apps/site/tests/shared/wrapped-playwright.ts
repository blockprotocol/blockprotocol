// eslint-disable-next-line no-restricted-imports
import { expect, test as base } from "playwright-test-coverage";

// eslint-disable-next-line no-restricted-imports
export * from "@playwright/test";

// Some messages only show up in `yarn dev` or `yarn start`. They should be checked in both modes before removing.
const tolerableConsoleMessageMatches: RegExp[] = [
  /Download the Apollo DevTools for a better development experience/,
  /Download the React DevTools for a better development experience/,
  /\[Fast Refresh\]/, // Next.js dev server (for local test runs)

  // You can add temporarily add more RegExps, but please track their removal
  // If a message only shows in few tests, please use setCustomTolerableConsoleMessageMatches([...])

  // @todo: Triage initial messages detected below https://app.asana.com/0/1203312852763953/1203414492513784/f
  /Image with src "\/_next\/static\/media\/primary-helix-min\.\w+\.png" was detected as the Largest Contentful Paint \(LCP\)\. Please add the "priority" property if this image is above the fold\./, // https://nextjs.org/docs/api-reference/next/legacy/image#priority
  /Failed to load resource: net::ERR_FAILED/,
  /Failed to load resource: the server responded with a status of 400 \(Bad Request\)/,
  /Failed to load resource: the server responded with a status of 404 \(Not Found\)/,
  /Warning: Each child in a list should have a unique "key" prop/,
  /Warning: Extra attributes from the server: ([\w%]+ )?class,tabindex/,
  /Warning: validateDOMNesting\(\.\.\.\): [\w%<>]+ cannot appear as a descendant of/,
  /Error: Abort fetching component for route: "\/dashboard\/\[\[...slugs\]\]"/,

  // FF
  /Cookie “blockprotocol-session-id” has been rejected because it is already expired/,
  /Cookie “blockprotocol-session-id” does not have a proper “SameSite” attribute value/,
  /Ignoring unsupported entryTypes: largest-contentful-paint/,
  /XML Parsing Error: syntax error/, // Location: http://localhost:3000/api/logout
  /Warning: Extra attributes from the server: __playwright_target__/,
  /Feature Policy: Skipping unsupported feature name “clipboard-write”/,
  /An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can remove its sandboxing/,
  /InstallTrigger is deprecated and will be removed in the future./,
  /onmozfullscreenchange is deprecated./,
  /onmozfullscreenerror is deprecated./,
  /Failed to fetch devPagesManifest: Error/,
  /downloadable font: download failed \(font-family: "Inter"/,
  /downloadable font: download failed \(font-family: "JetBrains Mono"/,
  /^\[error\] Error$/,
  /Layout was forced before the page was fully loaded. If stylesheets are not yet loaded this may cause a flash of unstyled content/,

  // Safari
  /Error: Abort fetching component for route: "\/login"/,
  /Web Inspector blocked http:\/\/localhost:\d+\/api\/me from loading/,
  /Failed to load resource: the server responded with a status of 401 \(Unauthorized\)/,
];

let customTolerableConsoleMessageMatches: RegExp[] = [];

export const setCustomTolerableConsoleMessageMatches = (matches: RegExp[]) => {
  customTolerableConsoleMessageMatches = matches;
};

/**
 * This is a wrapper around the Playwright test function that adds checks for console messages.
 * @see https://github.com/microsoft/playwright/discussions/11690#discussioncomment-2060397
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    const messages: string[] = [];
    page.on("console", (msg) => {
      const message = `[${msg.type()}] ${msg.text()}`;
      if (
        [
          ...tolerableConsoleMessageMatches,
          ...customTolerableConsoleMessageMatches,
        ].some((match) => match.test(message))
      ) {
        return;
      }
      messages.push(message);
    });
    await use(page);
    expect(messages).toStrictEqual([]);
  },
});

test.beforeAll(() => {
  customTolerableConsoleMessageMatches = [];
});
