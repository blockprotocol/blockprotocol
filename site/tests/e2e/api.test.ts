import { expect, test } from "playwright-test-coverage";

test("/api/me should be healthy", async ({ request }) => {
  // This test helps check DB connection. If the endpoint returns 500,
  // either DB is down or environment variables are misconfigured.
  const response = await request.get(`/api/me`);
  expect(response.status()).toBe(200);
  expect(await response.json()).toStrictEqual({ guest: true });
});
