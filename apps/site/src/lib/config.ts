export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL
  ? process.env.NEXT_PUBLIC_FRONTEND_URL
  : process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";

export const FRONTEND_DOMAIN = new URL(FRONTEND_URL).hostname;

export const isUsingHttps = new URL(FRONTEND_URL).protocol === "https";

export const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

export const isFork =
  process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER &&
  process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER !== "blockprotocol";

export const shouldUseDummyEmailService =
  !process.env.BP_AWS_REGION && !process.env.VERCEL;

/**
 * @todo: look into making feature flags more advanced
 *
 * @see https://app.asana.com/0/1203179076056209/1203763218224116/f
 */

export const shouldAllowNpmBlockPublishing =
  !!process.env.NEXT_PUBLIC_NPM_PUBLISHING;

// Whether or not the "billing" feature flag is enabled.
export const isBillingFeatureFlagEnabled =
  process.env.NEXT_PUBLIC_BILLING_FEATURE_FLAG === "1";
