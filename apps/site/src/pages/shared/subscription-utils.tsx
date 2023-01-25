import getSymbolFromCurrency from "currency-symbol-map";

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

export const priceToHumanReadable = ({
  amountInCents,
  currency,
  decimalPlaces = 2,
}: {
  amountInCents: number;
  currency: string;
  decimalPlaces?: number;
}) => {
  const currencySymbol = getSymbolFromCurrency(currency);

  const amount = (amountInCents * 0.01).toFixed(decimalPlaces);

  return currencySymbol
    ? `${currencySymbol}${amount}`
    : `${amount} ${currency}`;
};

export const dateToHumanReadable = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day < 10 ? "0" : ""}${day}/${
    month < 10 ? "0" : ""
  }${month}/${year}`;
};
