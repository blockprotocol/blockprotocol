import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

(await import("dotenv-flow")).config({ silent: true });

const ci = process.env.CI === "true";

// https://github.com/anishkny/playwright-test-coverage#options
process.env.ISTANBUL_TEMP_DIR = "../../.nyc_output";

const integrationTestsBaseConfig = {
  retries: 2,
  testMatch: "**/{integration,universal}/**",
};

const config: PlaywrightTestConfig = {
  forbidOnly: ci,
  projects: [
    {
      name: "integration-chrome",
      ...integrationTestsBaseConfig,
      use: {
        ...devices["Desktop Chrome"],
        // https://github.com/microsoft/playwright/issues/13037#issuecomment-1184698467
        contextOptions: { permissions: ["clipboard-read", "clipboard-write"] },
      },
    },
    {
      name: "integration-firefox",
      ...integrationTestsBaseConfig,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "integration-safari",
      ...integrationTestsBaseConfig,
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "integration-iphone",
      ...integrationTestsBaseConfig,
      use: { ...devices["iPhone 11 Pro"] },
    },
    {
      name: "integration-pixel",
      ...integrationTestsBaseConfig,
      use: {
        ...devices["Pixel 5"],
        // https://github.com/microsoft/playwright/issues/13037#issuecomment-1184698467
        contextOptions: { permissions: ["clipboard-read", "clipboard-write"] },
      },
    },
    {
      name: "e2e",
      retries: 1,
      testMatch: "**/{e2e,universal}/**",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  reporter: [
    [ci ? "github" : "list"],
    ["html", { open: !ci ? "on-failure" : "never" }],
  ],
  testDir: "tests",
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL ?? "http://localhost:3000",

    // Playwright docs recommend "on-first-retry" as it is slightly more resource-efficient.
    // We can switch to this option when we have more tests and most of them are stable.
    trace: "retain-on-failure",
  },

  workers: 1, // Concurrent tests break login
};

export default config;
