/**
 * Whether or not the "billing" feature flag is enabled.
 *
 * @todo: look into making feature flags more advanced
 */
export const isBillingFeatureFlagEnabled =
  process.env.NEXT_PUBLIC_BILLING_FEATURE_FLAG === "1";
