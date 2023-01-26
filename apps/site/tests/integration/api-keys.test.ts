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

  const tableWithKeys = page.locator("text=Public ID");
  const keyNameInput = page.locator('[placeholder="Key Name"]');

  await page.locator('a:has-text("Create and manage API keys")').click();
  await expect(page).toHaveURL("/settings/api-keys");

  await expect(
    page.locator("text=These keys allow you to access the block protocol"),
  ).toBeVisible();
  await expect(page.locator("data-test-id=apiKeyLink").first()).toHaveAttribute(
    "href",
    "/docs/embedding-blocks#discovering-blocks",
  );
  await expect(tableWithKeys).not.toBeVisible();

  await page.locator("button >> text=Create new key").click();

  await keyNameInput.click();
  await keyNameInput.press("Enter");

  await keyNameInput.fill("oops");
  await page.locator("text=Cancel").click();

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
    await expect(page.locator("text=✓ Copied")).toBeVisible();
  }
  await page.locator("text=Go back").click();

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
  await expect(page.locator("text=my first key")).toBeVisible();
  await expect(page.locator(`text=${publicKeyId}`)).toBeVisible();
  await page.locator("text=Regenerate API Key").click();

  await expect(page.locator('button:has-text("Regenerate Key")')).toBeVisible();
  await expect(
    page.locator("text=Regenerating the my first key key will invalidate it."),
  ).toBeVisible();

  await page.locator("text=Cancel").click();
  await expect(page.locator("text=Regenerate my first key")).not.toBeVisible();

  await page.locator("text=Regenerate API Key").click();
  await expect(page.locator('button:has-text("Regenerate Key")')).toBeVisible();

  await page.locator('button:has-text("Regenerate Key")').click();

  const apiKeyValue2 =
    (await page.locator('[data-testid="api-key-value"]').textContent()) ?? "";
  const publicKeyId2 = apiKeyValue2?.match(/\w{32}/)?.[0] ?? "";

  expect(apiKeyValue).not.toEqual(apiKeyValue2);
  expect(publicKeyId).not.toEqual(publicKeyId2);

  // ”Copy to Clipboard” does not work in Webkit on Linux
  if (browserName !== "webkit") {
    await page.locator("text=Copy to Clipboard").click();
    await expect(page.locator("text=✓ Copied")).toBeVisible();
  }
  await expect(page.locator("text=Key regenerated")).toBeVisible();
  await page.locator("text=Go back").click();

  await expect(page.locator(`text=${publicKeyId2}`)).toBeVisible();
  await expect(page.locator(`text=${publicKeyId}`)).not.toBeVisible();

  // @todo Consider moving to a separate test
  // (requires another run of API key generation logic, perhaps without UI)

  const response1 = await request.get("/api/blocks");
  expect(response1.status()).toBe(401);
  expect(await response1.json()).toEqual({
    errors: [
      { msg: "A valid API key must be provided in a 'x-api-key' header." },
    ],
  });

  const response2 = await request.get("/api/blocks", {
    headers: { "x-api-key": apiKeyValue },
  });
  expect(response2.status()).toBe(401);
  expect(await response2.json()).toEqual({
    errors: [{ msg: "API key has been revoked." }],
  });

  const response3 = await request.get("/api/blocks", {
    headers: { "x-api-key": "oops" },
  });
  expect(response3.status()).toBe(401);
  expect(await response3.json()).toEqual({
    errors: [{ msg: "API key does not match the expected format." }],
  });

  const response4 = await request.get("/api/blocks", {
    headers: {
      "x-api-key":
        "b10ck5.00000000000000000000000000000000.00000000-0000-0000-0000-000000000000",
    },
  });
  expect(response4.status()).toBe(401);
  expect(await response4.json()).toEqual({
    errors: [{ msg: "Invalid API key." }],
  });

  const response5 = await request.get("/api/blocks", {
    headers: { "x-api-key": apiKeyValue2 },
  });
  expect(response5.status()).toBe(200);
  const blocks = await response5.json();
  expect(blocks.errors).toBeUndefined();
  expect(Array.isArray(blocks.results)).toBeTruthy();
  expect(blocks.results[0].author).not.toBeUndefined();
  expect(blocks.results[0].displayName).not.toBeUndefined();
});
