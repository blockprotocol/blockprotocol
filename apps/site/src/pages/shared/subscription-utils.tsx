import { Theme } from "@mui/material";
import { StripeElementsOptions } from "@stripe/stripe-js";
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
    : currency
    ? `${amount} ${currency}`
    : amount.toString();
};

export const dateToHumanReadable = (
  date: Date,
  deliminator: string = "/",
  reverse: boolean = false,
) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const dateArray = [
    `${day < 10 ? "0" : ""}${day}`,
    `${month < 10 ? "0" : ""}${month}`,
    year,
  ];

  return (reverse ? dateArray.reverse() : dateArray).join(deliminator);
};

const cardBrands = {
  amex: "American Express",
  diners: "Diners",
  discover: "Discover",
  jcb: "JCB",
  mastercard: "Mastercard",
  unionpay: "UnionPay",
  visa: "Visa",
} as const;

type CardBrand = keyof typeof cardBrands;

export const cardBrandToHumanReadable = (cardBrand: string) =>
  cardBrands[cardBrand as CardBrand] ?? "Unknown";

export const createStripeOptions = (params: {
  clientSecret?: string;
  theme: Theme;
}): StripeElementsOptions => ({
  clientSecret: params.clientSecret,
  appearance: { variables: { colorDanger: params.theme.palette.error.main } },
});
