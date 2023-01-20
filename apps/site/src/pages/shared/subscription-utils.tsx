export const paidSubscriptionTiers = ["hobby", "pro"] as const;

export type PaidSubscriptionTier = (typeof paidSubscriptionTiers)[number];

export const isPaidSubscriptionTier = (
  tier: string,
): tier is PaidSubscriptionTier =>
  paidSubscriptionTiers.includes(tier as PaidSubscriptionTier);

export const subscriptionTiers = ["free", ...paidSubscriptionTiers] as const;

export type SubscriptionTier = (typeof subscriptionTiers)[number];

export const subscriptionTierToHumanReadable = (tier: SubscriptionTier) =>
  `${tier[0]?.toUpperCase()}${tier.slice(1)}`;
