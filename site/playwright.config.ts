import type { PlaywrightTestConfig } from "@playwright/test";

const ci = process.env.CI === "true";

const config: PlaywrightTestConfig = {
  forbidOnly: ci,
  projects: [
    { name: "integration", testMatch: "**/integration/**" },
    { name: "smoke", testMatch: "**/smoke/**" },
  ],
  reporter: [
    [ci ? "github" : "list"],
    ["html", { open: !ci ? "on-failure" : "never" }],
  ],
  retries: 0,
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
