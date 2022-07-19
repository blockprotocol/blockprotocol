import { expect, test } from "@playwright/test";

test("/api/me should respond with HTTP 401", async ({ request }) => {
  // This test helps check DB connection. If the endpoint returns 500,
  // either DB is down or environment variables are misconfigured.
  const response = await request.get(`/api/me`);
  expect(response.status()).toBe(401);
});
