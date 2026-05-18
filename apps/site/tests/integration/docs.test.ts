import { type Page, expect, test } from "../shared/wrapped-playwright.js";

const openMobileNav = async (page: Page): Promise<void> => {
  await page.locator("[data-testid='mobile-nav-trigger']").click();
  await expect(page.locator("[data-testid='mobile-nav']")).toBeVisible();
};

const closeMobileNav = async (page: Page) => {
  await page.locator("[data-testid='mobile-nav-trigger']").click();
  await expect(page.locator("[data-testid='mobile-nav']")).not.toBeVisible();
};

test("Docs page should contain key elements and interactions should work", async ({
  page,
  isMobile,
  browserName,
}) => {
  test.skip(
    browserName === "webkit",
    "https://app.asana.com/0/1202538466812818/1202659098334456",
  );

  await page.goto("/docs");

  await expect(page.locator('h1:has-text("Introduction")')).toBeVisible();

  const sidebarLocator = page.locator(
    isMobile ? "[data-testid='mobile-nav']" : "aside",
  );

  if (isMobile) {
    await openMobileNav(page);
  }

  await expect(sidebarLocator).toBeVisible();

  // The docs/spec sidebar is rendered with the versioned hrefs that come
  // out of `site-map.json` (e.g. `/docs/0.4/blocks`, `/spec/0.4`). The
  // unversioned entry-points (`/docs`, `/spec`) are routable for users —
  // they 308-redirect onto the latest version via `middleware.page.ts`,
  // see `redirectToLatestVersionIfMissing` — but the actual `<a href="">`
  // values in the sidebar are the version-prefixed forms. If we ever move
  // the latest-version segment out of the URL again, this list and the
  // navigation assertions below need to be updated together.
  for (const [name, href] of [
    ["Introduction", "/docs/0.4"],
    ["Blocks", "/docs/0.4/blocks"],
    ["Types", "/docs/0.4/types"],
    ["Services", "/docs/0.4/services"],
    ["FAQs", "/docs/0.4/faq"],
    ["Specification", "/spec/0.4"],
    ["Roadmap", "/roadmap"],
  ] as const) {
    const item = sidebarLocator.locator(`a:text-is("${name}")`).first();
    await expect(item).toBeVisible();
    await expect(item).toHaveAttribute("href", href);
  }

  // confirm expand button works
  await sidebarLocator
    .locator(':has-text("Introduction") + button')
    .first()
    .click();

  await expect(
    sidebarLocator.locator('a:has-text("Overview")').first(),
  ).not.toBeVisible();

  await sidebarLocator
    .locator(':has-text("Introduction") + button')
    .first()
    .click();

  await expect(
    sidebarLocator.locator('a:has-text("Overview")').first(),
  ).toBeVisible();

  if (isMobile) {
    await closeMobileNav(page);
  }

  await page.locator('h2:has-text("Overview") >> a').click();

  // The visit to `/docs` was 308-redirected to the latest version
  // (`/docs/0.4`) by `middleware.page.ts`, so the in-page anchor link
  // resolves on top of the versioned URL.
  await expect(page).toHaveURL("/docs/0.4#overview");

  await expect(page.locator('h2:has-text("Overview")')).toBeVisible();

  if (isMobile) {
    await openMobileNav(page);
  }

  // navigate to spec page (versioned URL — see comment on the sidebar
  // assertions above)
  await sidebarLocator.locator("a:has-text('Specification')").first().click();

  await expect(page).toHaveURL("/spec/0.4");

  await expect(page.locator('h1:has-text("Specification")')).toBeVisible();

  // confirm github card is rendered and urls are correct
  await expect(page.locator("[data-testid='github-info-card']")).toBeVisible();

  await expect(
    page.locator(
      "[data-testid='github-info-card'] >> a:has-text('our GitHub repo')",
    ),
  ).toHaveAttribute("href", "https://github.com/blockprotocol/blockprotocol");

  await expect(
    page.locator(
      "[data-testid='github-info-card'] >> a:has-text('View the spec on GitHub')",
    ),
  ).toHaveAttribute(
    "href",
    "https://github.com/blockprotocol/blockprotocol/tree/main/apps/site/src/_pages/spec",
  );

  // confirm specification footer nav contains the correct links
  // (also versioned: `prevPage`/`nextPage` come straight from sitemap)
  await expect(page.locator("text=PreviousFAQs >> a")).toBeVisible();

  await expect(page.locator("text=PreviousFAQs >> a")).toHaveAttribute(
    "href",
    "/docs/0.4/faq",
  );

  await expect(page.locator("text=NextCore >> a")).toBeVisible();

  await expect(page.locator("text=NextCore >> a")).toHaveAttribute(
    "href",
    "/spec/0.4/core",
  );

  if (isMobile) {
    await openMobileNav(page);
  }

  // Multiple sidebar entries can match `a:has-text('FAQs')` (the top-level
  // page link plus any section anchors that include "FAQs"), so disambiguate
  // with `.first()` — Playwright's strict mode fails the click otherwise.
  await sidebarLocator.locator("a:has-text('FAQs')").first().click();

  await expect(page.locator('h1:has-text("FAQs")')).toBeVisible();

  await expect(
    page.locator(
      "text=The Block Protocol provides a specification for the interaction between web blocks and applications using them: how data structures are typed and passed around, and what data operations are available to blocks.",
    ),
  ).not.toBeVisible();

  await page
    .locator(
      '[data-testid="ExpandMoreIcon"]:near(:has-text("What’s the point of the Block Protocol?"))',
    )
    .first()
    .click();

  await expect(
    page.locator(
      "text=The Block Protocol provides a specification for the interaction between web blocks and applications using them: how data structures are typed and passed around, and what data operations are available to blocks.",
    ),
  ).toBeVisible();
});

test("invalid docs page should redirect to 404", async ({ page }) => {
  await page.goto("/docs/non/existing/page");

  await expect(
    page.locator("text=This page could not be found."),
  ).toBeVisible();
});
