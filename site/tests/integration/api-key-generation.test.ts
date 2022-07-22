import { expect, test } from "playwright-test-coverage";

import { resetDb } from "../shared/fixtures";
import { login } from "../shared/nav";

test("API key page should generate and show a key", async ({
  page,
  browserName,
}) => {
  await resetDb();

  await page.goto("/");

  await login({ page });

  await page.goto("/dashboard");

  const tableWithKeys = page.locator("text=Public ID");
  const keyNameInput = page.locator('[placeholder="Key Name"]');

  await page.locator('a:has-text("Generate your API key")').click();
  await expect(page).toHaveURL("/settings/api-keys");

  await expect(
    page.locator("text=These keys allow you to access the block protocol"),
  ).toBeVisible();
  await expect(page.locator("text=Learn More").first()).toHaveAttribute(
    "href",
    "/docs/embedding-blocks#discovering-blocks",
  );
  await expect(tableWithKeys).not.toBeVisible();

  await page.locator("text=Create new key").click();

  await keyNameInput.click();
  await keyNameInput.press("Enter");

  await keyNameInput.fill("oops");
  await page.locator("text=Cancel").click();

  await page.locator("text=Create new key").click();
  await expect(keyNameInput).toHaveValue("");

  await keyNameInput.click();
  await keyNameInput.fill("my first key");
  await page.locator("text=Create Key").click();

  const apiKeyValue =
    (await page.locator('[data-testid="api-key-value"]').textContent()) ?? "";

  await page.locator("text=Copy to Clipboard").click();
  await expect(page.locator("text=✓ Copied")).toBeVisible();
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

  await expect(page.locator("text=Regenerate my first key")).toBeVisible();
  await expect(
    page.locator("text=Regenerating the my first key key will invalidate it."),
  ).toBeVisible();

  await page.locator("text=Cancel").click();
  await expect(page.locator("text=Regenerate my first key")).not.toBeVisible();

  await page.locator("text=Regenerate API Key").click();
  await expect(page.locator("text=Regenerate my first key")).toBeVisible();

  await page.locator("text=Regenerate key").click();

  const apiKeyValue2 =
    (await page.locator('[data-testid="api-key-value"]').textContent()) ?? "";
  const publicKeyId2 = apiKeyValue2?.match(/\w{32}/)?.[0] ?? "";

  expect(apiKeyValue).not.toEqual(apiKeyValue2);
  expect(publicKeyId).not.toEqual(publicKeyId2);

  await page.locator("text=Copy to Clipboard").click();
  await expect(page.locator("text=✓ Copied")).toBeVisible();
  await expect(page.locator("text=my first key regenerated")).toBeVisible();
  await page.locator("text=Go back").click();

  await expect(page.locator(`text=${publicKeyId2}`)).toBeVisible();
  await expect(page.locator(`text=${publicKeyId}`)).not.toBeVisible();
});
