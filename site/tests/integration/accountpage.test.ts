import execa from "execa";
import { expect, test } from "playwright-test-coverage";

import { readValueFromRecentDummyEmail } from "../shared/dummy-emails";
import { openLoginModal } from "../shared/nav";

const emailInputSelector = '[placeholder="claude\\@example\\.com"]';
const loginButtonSelector = "button[type=submit]:has-text('Log In')";
const verificationCodeInputSelector = '[placeholder="your-verification-code"]';
const accountDropdownButtonSelector = '[data-testid="account-dropdown-button"]';

// @todo add loginUser util

test("account page test", async ({ page, isMobile }) => {
  // Go to http://localhost:3000/
  await page.goto("http://localhost:3000/");

  await execa("yarn", ["exe", "scripts/seed-db.ts"]);

  await page.goto("/");
  const loginModal = await openLoginModal({ page, isMobile });

  const emailInput = loginModal.locator(emailInputSelector);
  const loginButton = loginModal.locator(loginButtonSelector);

  await emailInput.fill("alice@example.com");
  await loginButton.click();

  await expect(loginModal.locator("text=Check your inbox")).toBeVisible();

  const verificationCodeInput = loginModal.locator(
    verificationCodeInputSelector,
  );

  await verificationCodeInput.fill(
    await readValueFromRecentDummyEmail("Email verification code: "),
  );
  await verificationCodeInput.press("Enter");

  const accountDropdownButton = page.locator(accountDropdownButtonSelector);
  await expect(accountDropdownButton).toBeVisible();

  await page.goto("/@alice");

  await expect(page).toHaveURL("http://localhost:3000/@alice");

  // Click h3:has-text("Alice")
  await page.locator('h3:has-text("Alice")').click();

  // Click text=@alice
  await page.locator("text=@alice").click();

  // Click text=Overview
  await page.locator("text=Overview").click();
  await expect(page).toHaveURL("http://localhost:3000/@alice");

  // Click text=You haven’t created any blocks or schemas yet
  await page
    .locator("text=You haven’t created any blocks or schemas yet")
    .click();

  // Click text=Start building to see your creations show up here.
  await page
    .locator("text=Start building to see your creations show up here.")
    .click();

  // Click text=Build a block
  await page.locator("text=Build a block").click();
  await expect(page).toHaveURL("http://localhost:3000/docs/developing-blocks");

  // Go to http://localhost:3000/@alice
  await page.goto("http://localhost:3000/@alice");

  // Click text=Create a schema
  await page.locator("text=Create a schema").click();

  // Click text=Blocks0
  await page.locator("text=Blocks0").click();
  await expect(page).toHaveURL("http://localhost:3000/@alice/blocks");

  // Click text=You haven’t created any blocks yet
  await page.locator("text=You haven’t created any blocks yet").click();

  // Click text=Start building to see your creations show up here.
  await page
    .locator("text=Start building to see your creations show up here.")
    .click();

  // Click text=Build a block
  await page.locator("text=Build a block").click();
  await expect(page).toHaveURL("http://localhost:3000/@alice/blocks");

  // Go to http://localhost:3000/@alice/blocks
  await page.goto("http://localhost:3000/@alice/blocks");

  // Click text=Schemas0
  await page.locator("text=Schemas0").click();
  await expect(page).toHaveURL("http://localhost:3000/@alice/schemas");

  // Click text=You haven’t created any schemas yet
  await page.locator("text=You haven’t created any schemas yet").click();

  // Click text=Start building to see your creations show up here.
  await page
    .locator("text=Start building to see your creations show up here.")
    .click();

  // Click text=Create a schema
  await page.locator("text=Create a schema").click();

  // Click [aria-label="Close"]
  await page.locator('[aria-label="Close"]').click();

  // Click text=AAlice@alice >> p >> nth=0
  await page.locator("text=AAlice@alice >> p").first().click();

  // Click [aria-label="Hide Errors"]
  await page.locator('[aria-label="Hide Errors"]').click();

  // Go to http://localhost:3000/@hash
  await page.goto("http://localhost:3000/@hash");

  // Click h3:has-text("HASH")
  await page.locator('h3:has-text("HASH")').click();

  // Click text=@hash
  await page.locator("text=@hash").click();

  // Click a[role="tab"]:has-text("Overview")
  await page.locator('a[role="tab"]:has-text("Overview")').click();
  await expect(page).toHaveURL("http://localhost:3000/@hash");

  // Click p:has-text("Code")
  await page.locator('p:has-text("Code")').click();
  await expect(page).toHaveURL("http://localhost:3000/@hash/blocks/code");

  // Go to http://localhost:3000/@hash
  await page.goto("http://localhost:3000/@hash");

  // Click text=Write monospaced code with syntax highlighting in a range of programming and mar
  await page
    .locator(
      "text=Write monospaced code with syntax highlighting in a range of programming and mar",
    )
    .click();
  await expect(page).toHaveURL("http://localhost:3000/@hash");

  // Go to http://localhost:3000/@hash
  await page.goto("http://localhost:3000/@hash");

  // Click text=0.2.0 >> nth=0
  await page.locator("text=0.2.0").first().click();
  await expect(page).toHaveURL("http://localhost:3000/@hash");

  // Click text=CodeBlock >> span
  await page.locator("text=CodeBlock >> span").click();
  await expect(page).toHaveURL("http://localhost:3000/@hash");

  // Click a[role="tab"]:has-text("Blocks6")
  await page.locator('a[role="tab"]:has-text("Blocks6")').click();
  await expect(page).toHaveURL("http://localhost:3000/@hash/blocks");

  // Click #profile-tabpanel-1 div:has-text("CodeWrite monospaced code with syntax highlighting in a range of programming and") >> nth=0
  await page
    .locator(
      '#profile-tabpanel-1 div:has-text("CodeWrite monospaced code with syntax highlighting in a range of programming and")',
    )
    .first()
    .click();
  await expect(page).toHaveURL("http://localhost:3000/@hash/blocks");

  // Go to http://localhost:3000/@hash/blocks
  await page.goto("http://localhost:3000/@hash/blocks");

  // Click p:has-text("Code")
  await page.locator('p:has-text("Code")').click();
  await expect(page).toHaveURL("http://localhost:3000/@hash/blocks");

  // Click a[role="tab"]:has-text("Schemas0")
  await page.locator('a[role="tab"]:has-text("Schemas0")').click();
  await expect(page).toHaveURL("http://localhost:3000/@hash/schemas");

  // Click text=@hash hasn’t published any schemas yet
  await page.locator("text=@hash hasn’t published any schemas yet").click();

  // Click text=You can browse existing schemas on the Block Hub.
  await page
    .locator("text=You can browse existing schemas on the Block Hub.")
    .click();

  // Click text=Browse the Block Hub
  await page.locator("text=Browse the Block Hub").click();
  await expect(page).toHaveURL("http://localhost:3000/@hash/schemas");

  // Go to http://localhost:3000/@hash/schemas
  await page.goto("http://localhost:3000/@hash/schemas");

  // Go to http://localhost:3000/@no-user
  await page.goto("http://localhost:3000/@no-user");

  // Click text=404
  await page.locator("text=404").click();

  // Click text=This page could not be found.
  await page.locator("text=This page could not be found.").click();

  // Go to http://localhost:3000/@alice
  await page.goto("http://localhost:3000/@alice");

  // Click text=Create a schema
  await page.locator("text=Create a schema").click();

  // Click text=Create New Schema
  await page.locator("text=Create New Schema").click();

  // Click text=Schemas are used to define the structure of entities - in other words, define a
  await page
    .locator(
      "text=Schemas are used to define the structure of entities - in other words, define a ",
    )
    .click();

  // Click label:has-text("Schema Title *")
  await page.locator('label:has-text("Schema Title *")').click();

  // Click text=Schema Title *Schema Title * >> input[type="text"]
  await page
    .locator('text=Schema Title *Schema Title * >> input[type="text"]')
    .click();

  // Fill text=Schema Title *Schema Title * >> input[type="text"]
  await page
    .locator('text=Schema Title *Schema Title * >> input[type="text"]')
    .fill("Testing+schema");

  // Click div[role="presentation"] button:has-text("Create")
  await page
    .locator('div[role="presentation"] button:has-text("Create")')
    .click();

  // Click text=Invalid schema: Schema 'title' must start with an uppercase letter, and contain
  await page
    .locator(
      "text=Invalid schema: Schema 'title' must start with an uppercase letter, and contain ",
    )
    .click();

  // Click text=Schema Title *Schema Title * >> input[type="text"]
  await page
    .locator('text=Schema Title *Schema Title * >> input[type="text"]')
    .click();

  // Fill text=Schema Title *Schema Title * >> input[type="text"]
  await page
    .locator('text=Schema Title *Schema Title * >> input[type="text"]')
    .fill("Testing");

  // Click div[role="presentation"] button:has-text("Create")
  await page
    .locator('div[role="presentation"] button:has-text("Create")')
    .click();
  await expect(page).toHaveURL("http://localhost:3000/@alice/types/Testing");

  // Click text=@alice >
  await page.locator("text=@alice >").click();
  await expect(page).toHaveURL("http://localhost:3000/@alice/types/Testing");

  // Click text=Testing Schema
  await page.locator("text=Testing Schema").click();

  // Click text=You can use this editor to build basic schemas, representing types of entities.
  await page
    .locator(
      "text=You can use this editor to build basic schemas, representing types of entities.",
    )
    .click();

  // Click text=You can use these entity types as the expected value for a property in another s
  await page
    .locator(
      "text=You can use these entity types as the expected value for a property in another s",
    )
    .click();

  // Click [placeholder="newProperty"]
  await page.locator('[placeholder="newProperty"]').click();

  // Fill [placeholder="newProperty"]
  await page.locator('[placeholder="newProperty"]').fill("label");

  // Click text=Create Property
  await page.locator("text=Create Property").click();

  // Click [placeholder="The property name"]
  await page.locator('[placeholder="The property name"]').click();

  // Click [placeholder="The property name"]
  await page.locator('[placeholder="The property name"]').click();

  // Click [placeholder="newProperty"]
  await page.locator('[placeholder="newProperty"]').click();

  // Fill [placeholder="newProperty"]
  await page.locator('[placeholder="newProperty"]').fill("value1");

  // Click text=Create Property
  await page.locator("text=Create Property").click();

  // Click text=Delete >> nth=2
  await page.locator("text=Delete").nth(2).click();

  // Click [aria-label="Close"]
  await page.locator('[aria-label="Close"]').click();

  // Click [placeholder="newProperty"]
  await page.locator('[placeholder="newProperty"]').click();

  // Fill [placeholder="newProperty"]
  await page.locator('[placeholder="newProperty"]').fill("value");

  // Click text=Create Property
  await page.locator("text=Create Property").click();

  // Click text=http://localhost:3000/types/f74dd9af-aa81-4903-b77e-a9c52e6e025e
  await page
    .locator(
      "text=http://localhost:3000/types/f74dd9af-aa81-4903-b77e-a9c52e6e025e",
    )
    .click();
  await expect(page).toHaveURL("http://localhost:3000/@alice/types/Testing");

  // Click text=this link
  const [page1] = await Promise.all([
    page.waitForEvent("popup"),
    page.locator("text=this link").click(),
  ]);

  // Click pre
  await page1.locator("pre").click();

  // Click text=@alice >
  await page.locator("text=@alice >").click();
  await expect(page).toHaveURL("http://localhost:3000/@alice");

  // Click text=Schemas1
  await page.locator("text=Schemas1").click();
  await expect(page).toHaveURL("http://localhost:3000/@alice/schemas");

  // Click text=Testing
  await page.locator("text=Testing").click();
  await expect(page).toHaveURL("http://localhost:3000/@alice/schemas");

  // Go to http://localhost:3000/@alice/schemas
  await page.goto("http://localhost:3000/@alice/schemas");

  // Click text=Create New Schema
  await page.locator("text=Create New Schema").click();

  // Fill text=Schema Title *Schema Title * >> input[type="text"]
  await page
    .locator('text=Schema Title *Schema Title * >> input[type="text"]')
    .fill("Testing");

  // Click div[role="presentation"] button:has-text("Create")
  await page
    .locator('div[role="presentation"] button:has-text("Create")')
    .click();

  // Click text=Invalid schema: User already has a schema with title Testing
  await page
    .locator(
      "text=Invalid schema: User already has a schema with title Testing",
    )
    .click();
});
