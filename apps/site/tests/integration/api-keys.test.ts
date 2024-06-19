import { resetSite } from "../shared/fixtures.js";
import { login } from "../shared/nav.js";
import { expect, test } from "../shared/wrapped-playwright.js";

test("API key page should generate a valid key", async ({
  page,
  browserName,
  request,
}) => {
  if (browserName === "webkit") {
    // Some locator actions take 3 seconds instead of a few milliseconds,
    // so this long test often takes more than 30 seconds to run.
    // We can try switching back to the default timeout after updating Playwright.
    // See details in https://github.com/blockprotocol/blockprotocol/pull/821
    test.setTimeout(60000);
  }

  await resetSite();

  await page.goto("/");

  await login({ page });

  await page.goto("/dashboard");

  const tableWithKeys = page.locator("text=Last used");
  const keyNameInput = page.locator('[placeholder="Key name"]');

  await page.locator('a:has-text("Create and manage API keys")').click();
  await expect(page).toHaveURL("/account/api");

  await expect(
    page.locator(
      "text=API keys allow you to access the Block Protocol from within other applications.",
    ),
  ).toBeVisible();
  await expect(page.locator("data-test-id=apiKeyLink").first()).toHaveAttribute(
    "href",
    "/docs/hub/api",
  );
  await expect(tableWithKeys).not.toBeVisible();

  await page.locator("button >> text=Create new key").click();

  await keyNameInput.click();
  await keyNameInput.press("Enter");

  await keyNameInput.fill("oops");
  await page.locator("data-testid=close-card-button").click();

  await page.locator("button >> text=Create new key").click();
  await expect(keyNameInput).toHaveValue("");

  await keyNameInput.click();
  await keyNameInput.fill("my first key");
  await page.locator("text=Create Key").click();

  const apiKeyValue =
    (await page.locator('[data-testid="api-key-value"]').textContent()) ?? "";

  // ”Copy to Clipboard” does not work in Webkit on Linux
  if (browserName !== "webkit") {
    await page.locator("text=Copy to Clipboard").click();
    await expect(page.locator("text=Copied to clipboard")).toBeVisible();
  }

  expect(apiKeyValue).toMatch(
    /^b10ck5\.\w{32}\.\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/,
  );
  const publicKeyId = apiKeyValue?.match(/\w{32}/)?.[0] ?? "";

  // https://github.com/microsoft/playwright/issues/13037
  if (browserName === "chromium") {
    const copiedApiKey = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(copiedApiKey).toEqual(apiKeyValue);
  }

  await expect(tableWithKeys).toBeVisible();
  await expect(page.locator(`text=${publicKeyId}`)).toBeVisible();

  /** @todo add tests for rename/revoke/create multiple */

  const response1 = await request.get("/api/blocks");
  expect(response1.status()).toBe(401);
  expect(await response1.json()).toEqual({
    errors: [
      {
        message: "A valid API key must be provided in a 'x-api-key' header.",
        msg: "A valid API key must be provided in a 'x-api-key' header.",
      },
    ],
  });

  /** @todo use code below to test revoked keys, when test case for revoked key is added back  */
  // const response2 = await request.get("/api/blocks", {
  //   headers: { "x-api-key": apiKeyValue },
  // });
  // expect(response2.status()).toBe(401);
  // expect(await response2.json()).toEqual({
  //   errors: [
  //     {
  //       message: "API key has been revoked.",
  //       msg: "API key has been revoked.",
  //     },
  //   ],
  // });

  const response3 = await request.get("/api/blocks", {
    headers: { "x-api-key": "oops" },
  });
  expect(response3.status()).toBe(401);
  expect(await response3.json()).toEqual({
    errors: [
      {
        message: "API key does not match the expected format.",
        msg: "API key does not match the expected format.",
      },
    ],
  });

  const response4 = await request.get("/api/blocks", {
    headers: {
      "x-api-key":
        "b10ck5.00000000000000000000000000000000.00000000-0000-0000-0000-000000000000",
    },
  });
  expect(response4.status()).toBe(401);
  expect(await response4.json()).toEqual({
    errors: [{ message: "Invalid API key.", msg: "Invalid API key." }],
  });

  const response5 = await request.get("/api/blocks", {
    headers: { "x-api-key": apiKeyValue },
  });
  expect(response5.status()).toBe(200);
  const blocks = await response5.json();
  expect(blocks.errors).toBeUndefined();
  expect(Array.isArray(blocks.results)).toBeTruthy();
  expect(blocks.results[0].author).not.toBeUndefined();
  expect(blocks.results[0].displayName).not.toBeUndefined();
});
