import { expect, test } from "playwright-test-coverage";

test.skip("API key generation UI works", async ({ page }) => {
  await page.goto("/");

  // Click header >> text=Log In
  await page.locator("header >> text=Log In").click();
  await expect(page).toHaveURL("/");

  // Fill [placeholder="claude\@example\.com"]
  await page.locator('[placeholder="claude\\@example\\.com"]').fill("oops");

  // Press Enter
  await page.locator('[placeholder="claude\\@example\\.com"]').press("Enter");

  // Press a with modifiers
  await page.locator('[placeholder="claude\\@example\\.com"]').press("Meta+a");

  // Fill [placeholder="claude\@example\.com"]
  await page
    .locator('[placeholder="claude\\@example\\.com"]')
    .fill("alice@example.com");

  // Click div[role="presentation"] >> text=Log In
  await page.locator('div[role="presentation"] >> text=Log In').click();

  // Fill [placeholder="your-verification-code"]
  await page.locator('[placeholder="your-verification-code"]').fill("oops");

  // Press Enter
  await page.locator('[placeholder="your-verification-code"]').press("Enter");

  // Press a with modifiers
  await page.locator('[placeholder="your-verification-code"]').press("Meta+a");

  // Fill [placeholder="your-verification-code"]
  await page
    .locator('[placeholder="your-verification-code"]')
    .fill("prophages-numberer-exploit-naturalism");

  // Click button:has-text("A") >> nth=1
  await page.locator('button:has-text("A")').nth(1).click();

  // Click div[role="button"]:has-text("Dashboard")
  await page.locator('div[role="button"]:has-text("Dashboard")').click();
  await expect(page).toHaveURL("/dashboard");

  // Click a:has-text("Generate your API keyYour API key will allow you to search for blocks by name, a")
  await page
    .locator(
      'a:has-text("Generate your API keyYour API key will allow you to search for blocks by name, a")',
    )
    .click();
  await expect(page).toHaveURL("/settings/api-keys");

  // Click text=API KeysThese keys allow you to access the block protocol from within your appli
  await page
    .locator(
      "text=API KeysThese keys allow you to access the block protocol from within your appli",
    )
    .click();

  // Click text=Create new key
  await page.locator("text=Create new key").click();

  // Click [placeholder="Key Name"]
  await page.locator('[placeholder="Key Name"]').click();

  // Press Enter
  await page.locator('[placeholder="Key Name"]').press("Enter");

  // Fill [placeholder="Key Name"]
  await page.locator('[placeholder="Key Name"]').fill("oops");

  // Press a with modifiers
  await page.locator('[placeholder="Key Name"]').press("Meta+a");

  // Fill [placeholder="Key Name"]
  await page.locator('[placeholder="Key Name"]').fill("hello");

  // Press a with modifiers
  await page.locator('[placeholder="Key Name"]').press("Meta+a");

  // Fill [placeholder="Key Name"]
  await page.locator('[placeholder="Key Name"]').fill("my first key");

  // Click text=Cancel
  await page.locator("text=Cancel").click();

  // Click [aria-label="Close"]
  await page.locator('[aria-label="Close"]').click();

  // Click text=Create new key
  await page.locator("text=Create new key").click();

  // Click [placeholder="Key Name"]
  await page.locator('[placeholder="Key Name"]').click();

  // Fill [placeholder="Key Name"]
  await page.locator('[placeholder="Key Name"]').fill("my first key");

  // Click text=Create Key
  await page.locator("text=Create Key").click();

  // Click text=Copy to Clipboard
  await page.locator("text=Copy to Clipboard").click();

  // Click div:has-text("✓ Copied") >> nth=4
  await page.locator('div:has-text("✓ Copied")').nth(4).click();

  // Click text=Go back
  await page.locator("text=Go back").click();

  // Click text=API KeysThese keys allow you to access the block protocol from within your appli
  await page
    .locator(
      "text=API KeysThese keys allow you to access the block protocol from within your appli",
    )
    .click();

  // Click text=Regenerate API Key
  await page.locator("text=Regenerate API Key").click();

  // Click text=Regenerating the my first key key will invalidate it. This could break any appli
  await page
    .locator(
      "text=Regenerating the my first key key will invalidate it. This could break any appli",
    )
    .click();

  // Click text=Cancel
  await page.locator("text=Cancel").click();

  // Click text=Regenerate API Key
  await page.locator("text=Regenerate API Key").click();

  // Click text=Regenerate Key
  await page.locator("text=Regenerate Key").click();

  // Click div:has-text("Copy to Clipboard") >> nth=4
  await page.locator('div:has-text("Copy to Clipboard")').nth(4).click();

  // Click div:has-text("✓ Copied") >> nth=4
  await page.locator('div:has-text("✓ Copied")').nth(4).click();

  // Click text=my first key regenerated
  await page.locator("text=my first key regenerated").click();

  // Click text=The previous key will no longer work.
  await page.locator("text=The previous key will no longer work.").click();

  // Click text=Go back
  await page.locator("text=Go back").click();

  // Click text=Dashboard
  await page.locator("text=Dashboard").click();
  await expect(page).toHaveURL("/dashboard");

  // Click text=API Keys
  await page.locator("text=API Keys").click();
  await expect(page).toHaveURL("/settings/api-keys");
});
