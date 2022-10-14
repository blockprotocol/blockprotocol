import { expect, test } from "playwright-test-coverage";

import { closeMobileNav, openMobileNav } from "../shared/nav";

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

  for (const [name, href] of [
    ["Introduction", "/docs"],
    ["Developing Blocks", "/docs/developing-blocks"],
    ["Embedding Blocks", "/docs/embedding-blocks"],
    ["Specification", "/docs/spec"],
    ["FAQs", "/docs/faq"],
  ] as const) {
    const item = sidebarLocator.locator(`a:has-text("${name}")`).first();
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

  await expect(page).toHaveURL("/docs#overview");

  await expect(page.locator('h2:has-text("Overview")')).toBeVisible();

  if (isMobile) {
    await openMobileNav(page);
  }

  // navigate to spec page
  await sidebarLocator.locator("a:has-text('Specification')").first().click();

  await expect(page).toHaveURL("/docs/spec");

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
    "https://github.com/blockprotocol/blockprotocol/tree/main/apps/site/src/_pages/docs/3_spec",
  );

  // confirm docs footer nav have correct links
  await expect(
    page.locator("text=PreviousEmbedding Blocks >> a"),
  ).toBeVisible();

  await expect(
    page.locator("text=PreviousEmbedding Blocks >> a"),
  ).toHaveAttribute("href", "/docs/embedding-blocks");

  await expect(page.locator("text=NextCore >> a")).toBeVisible();

  await expect(page.locator("text=NextCore >> a")).toHaveAttribute(
    "href",
    "/docs/spec/core",
  );

  if (isMobile) {
    await openMobileNav(page);
  }

  await sidebarLocator.locator("a:has-text('FAQs')").click();

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

  await page.goto("/docs/spec");

  const footerCTALocator = page.locator("data-test-id=footerCTA");
  await expect(footerCTALocator).toBeVisible();

  await expect(footerCTALocator.locator('text="Learn more"')).toHaveAttribute(
    "href",
    "/docs/embedding-blocks",
  );

  await expect(footerCTALocator.locator('text="Hub"')).toHaveAttribute(
    "href",
    "/hub",
  );

  await expect(
    footerCTALocator.locator('text="Read the quickstart guide"'),
  ).toHaveAttribute("href", "/docs/developing-blocks");
});

test("invalid docs page should redirect to 4040", async ({ page }) => {
  await page.goto("/docs/non/existing/page");

  await expect(
    page.locator("text=This page could not be found."),
  ).toBeVisible();
});
