import { expect, test } from "playwright-test-coverage";

test("Playwright cookies on multiple pages", async ({ page, context }) => {
  await page.goto("https://example.com");

  await page.evaluate(() => {
    document.cookie = "test1=Hello";
  });

  const cookie = await page.evaluate(() => document.cookie);

  const page2 = await context.newPage();
  await page2.goto("https://example.com");

  const cookie2 = await page2.evaluate(() => document.cookie);

  // eslint-disable-next-line no-console
  console.log({ cookie, cookie2 });
  expect(cookie).toMatch(cookie2);
});
