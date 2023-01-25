import {
  Configuration,
  DefaultApi as InternalApiClient,
} from "@local/internal-api-client";
import type { Stripe } from "stripe";

const basePath = "/api/internal";

const config = new Configuration({ basePath });

export const internalApi = new InternalApiClient(config, basePath);

declare module "@local/internal-api-client" {
  interface StripeSubscription extends Stripe.Subscription {}
  interface StripePrice extends Stripe.Price {}
}

export const getDateFromStripeDate = (stripeDate: number): Date => {
  const date = new Date(0);

  date.setUTCSeconds(stripeDate);

  return date;
};
