import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

const ci = process.env.CI === "true";

const devicesToUse = [
  "Desktop Chrome",
  "Desktop Firefox",
  "Desktop Safari",
  "iPhone 11 Pro",
  "Pixel 5",
];

const config: PlaywrightTestConfig = {
  forbidOnly: ci,
  projects: [
    ...devicesToUse.map((deviceName) => ({
      name: `integration - ${deviceName}`,
      retries: 1,
      testMatch: "**/{integration,universal}/**",
      use: { ...devices[deviceName] },
    })),
    {
      name: "smoke",
      retries: 0,
      testMatch: "**/{smoke,universal}/**",
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
