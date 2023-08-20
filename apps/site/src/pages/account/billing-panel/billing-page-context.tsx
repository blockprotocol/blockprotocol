import { SubscriptionTierPrices } from "@local/internal-api-client";
import { createContext, useContext } from "react";
import Stripe from "stripe";

export type BillingPageContextValue = {
  paymentMethods?: Stripe.PaymentMethod[];
  refetchPaymentMethods?: () => Promise<void>;
  subscription?: Stripe.Subscription;
  refetchSubscription?: () => Promise<void>;
  subscriptionTierPrices?: SubscriptionTierPrices;
};

export const BillingPageContext = createContext<BillingPageContextValue | null>(
  null,
);

export const useBillingPageContext = () => {
  const contextValue = useContext(BillingPageContext);

  if (!contextValue) {
    throw new Error("No billing page context value has been provided");
  }

  return contextValue;
};
