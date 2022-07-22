import { expect, test } from "playwright-test-coverage";

test("Docs page should contain key elements and interactions should work well", async ({
  page,
  isMobile,
}) => {
  // @todo add mobile tests
  test.skip(!!isMobile);

  // Go to http://localhost:3000/docs
  await page.goto("http://localhost:3000/docs");

  await expect(page.locator("aside")).toBeVisible();

  await expect(page.locator('h1:has-text("Introduction")')).toBeVisible();

  // confirm all top nav links are visible in sidebar
  for (const [name, href] of [
    ["Introduction", "/docs"],
    ["Developing Blocks", "/docs/developing-blocks"],
    ["Embedding Blocks", "/docs/embedding-blocks"],
    ["Specification", "/docs/spec"],
    ["FAQs", "/docs/faq"],
  ] as const) {
    const item = page.locator(`aside >> text="${name}"`).first();
    await expect(item).toBeVisible();
    await expect(item).toHaveAttribute("href", href);
  }

  // confirm toggle works
  await page
    .locator('aside >> a:has-text("Introduction") + button')
    .first()
    .click();
  await expect(
    page.locator('aside >> a:has-text("Overview")').first(),
  ).not.toBeVisible();
  await page
    .locator('aside >> a:has-text("Introduction") + button')
    .first()
    .click();
  await expect(
    page.locator('aside >> a:has-text("Overview")').first(),
  ).toBeVisible();

  //  check if clicking on header text updates url
  await page.locator('aside >> a:has-text("Overview")').first().click();
  await expect(page).toHaveURL("http://localhost:3000/docs#overview");
  await expect(page.locator('h2:has-text("Overview")')).toBeVisible();

  //  navigate to spec page
  await page.locator("aside >> a:has-text('Specification')").first().click();
  await expect(page).toHaveURL("http://localhost:3000/docs/spec");
  await expect(page.locator('h1:has-text("Specification")')).toBeVisible();

  //  confirm github card is rendered and urls are correct
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
    "https://github.com/blockprotocol/blockprotocol/tree/main/site/src/_pages/docs/3_spec",
  );

  // confirm docs footer nav have correct links
  await expect(
    page.locator("text=PreviousEmbedding Blocks >> a"),
  ).toBeVisible();
  await expect(
    page.locator("text=PreviousEmbedding Blocks >> a"),
  ).toHaveAttribute("href", "/docs/embedding-blocks");

  await expect(
    page.locator("text=NextCore Specification 0.2 >> a"),
  ).toBeVisible();
  await expect(
    page.locator("text=NextCore Specification 0.2 >> a"),
  ).toHaveAttribute("href", "/docs/spec/core-specification");

  await page.locator("aside >> a:has-text('FAQs')").click();
  await page.locator('h1:has-text("FAQs")').click();

  await expect(
    page.locator(
      "text=The Block Protocol provides a specification for the interaction between web blocks and applications using them: how data structures are typed and passed around, and what data operations are available to blocks.",
    ),
  ).not.toBeVisible();

  await page
    .locator(
      'div[role="button"]:has-text("What’s the point of the Block Protocol?")',
    )
    .click();

  await expect(
    page.locator(
      "text=The Block Protocol provides a specification for the interaction between web blocks and applications using them: how data structures are typed and passed around, and what data operations are available to blocks.",
    ),
  ).toBeVisible();
});

test("invalid docs page should redirect to 4040", async ({ page }) => {
  await page.goto("/docs/non/existing/page");

  await expect(
    page.locator("text=This page could not be found."),
  ).toBeVisible();
});
