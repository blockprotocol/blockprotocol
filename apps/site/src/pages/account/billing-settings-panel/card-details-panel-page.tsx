import { UpdatePaymentMethodRequestUpdatedBillingDetails } from "@local/internal-api-client";
import { Box, Typography, useTheme } from "@mui/material";
import { AddressElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import {
  FormEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Button } from "../../../components/button";
import { internalApi } from "../../../lib/internal-api-client";
import { createStripeOptions } from "../../shared/subscription-utils";
import { useBillingPageContext } from "./billing-page-context";
import { PaymentMethod } from "./payment-method";
import { paymentMethodsPanelPageAsPath } from "./payment-methods";

const stripeCardBrandToHumanReadable = {
  amex: "American Express",
  diners: "Diners Club International",
  discover: "Discover",
  jcb: "JCB",
  mastercard: "Mastercard",
  unionpay: "UnionPay",
  visa: "Visa",
} as const;

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_API_KEY ?? "",
);

type KnownStripeCardBrand = keyof typeof stripeCardBrandToHumanReadable;

const isKnownStripeCardBrand = (brand: string): brand is KnownStripeCardBrand =>
  Object.keys(stripeCardBrandToHumanReadable).includes(
    brand as KnownStripeCardBrand,
  );

export const cardDetailsPanelPageAsPath = "/account/billing/payment-method";

export const CardDetailsPanelPage: FunctionComponent = () => {
  const router = useRouter();
  const { paymentMethods, refetchPaymentMethods } = useBillingPageContext();

  const [isComplete, setIsComplete] = useState<boolean>(false);

  const [updatingBillingDetails, setUpdatingBillingDetails] =
    useState<boolean>(false);
  const [updatedBillingDetails, setUpdatedBillingDetails] =
    useState<UpdatePaymentMethodRequestUpdatedBillingDetails>();

  const paymentMethod = useMemo(() => {
    if (router.isReady && paymentMethods) {
      const matchingPaymentMethod = paymentMethods.find(
        ({ id }) => id === router.query.id,
      );

      if (!matchingPaymentMethod) {
        void router.push(paymentMethodsPanelPageAsPath);
      }

      return matchingPaymentMethod;
    }
  }, [router, paymentMethods]);

  const currentBillingDetails = paymentMethod?.billing_details;

  useEffect(() => {
    if (currentBillingDetails) {
      const { name, address } = currentBillingDetails;
      setUpdatedBillingDetails({
        name: name ?? undefined,
        address: {
          line1: address?.line1 ?? undefined,
          line2: address?.line2 ?? undefined,
          city: address?.city ?? undefined,
          state: address?.state ?? undefined,
          postal_code: address?.postal_code ?? undefined,
          country: address?.country ?? undefined,
        },
      });
    }
  }, [currentBillingDetails]);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!paymentMethod || !updatedBillingDetails) {
        return;
      }

      setUpdatingBillingDetails(true);

      await internalApi.updatePaymentMethod(paymentMethod.id, {
        updatedBillingDetails,
      });

      await refetchPaymentMethods?.();

      setUpdatingBillingDetails(false);
    },
    [paymentMethod, updatedBillingDetails, refetchPaymentMethods],
  );

  const theme = useTheme();

  const stripeElementsOptions = useMemo<StripeElementsOptions>(
    () => createStripeOptions({ theme }),
    [theme],
  );

  return (
    <>
      <Typography
        variant="bpBodyCopy"
        sx={{ color: ({ palette }) => palette.gray[90], marginBottom: 4 }}
      >
        Change the details on file associated with your{" "}
        {paymentMethod?.card?.brand &&
        isKnownStripeCardBrand(paymentMethod.card.brand)
          ? `${stripeCardBrandToHumanReadable[paymentMethod?.card?.brand]} `
          : ""}{" "}
        card
      </Typography>
      <Typography
        variant="bpBodyCopy"
        sx={{
          textTransform: "uppercase",
          color: ({ palette }) => palette.gray[90],
        }}
      >
        <strong>Card on file</strong>
      </Typography>
      <Box marginBottom={4}>
        {paymentMethod ? <PaymentMethod paymentMethod={paymentMethod} /> : null}
      </Box>
      <Typography
        variant="bpBodyCopy"
        sx={{
          textTransform: "uppercase",
          color: ({ palette }) => palette.gray[90],
          marginBottom: 1,
        }}
      >
        <strong>Billing address</strong>
      </Typography>
      <Elements stripe={stripePromise} options={stripeElementsOptions}>
        {currentBillingDetails ? (
          <Box maxWidth={420} component="form" onSubmit={handleSubmit}>
            <AddressElement
              options={{
                mode: "billing",
                defaultValues: {
                  name: currentBillingDetails.name,
                  address: {
                    line1: currentBillingDetails.address?.line1 ?? undefined,
                    line2: currentBillingDetails.address?.line2 ?? undefined,
                    city: currentBillingDetails.address?.city ?? undefined,
                    state: currentBillingDetails.address?.state ?? undefined,
                    postal_code:
                      currentBillingDetails.address?.postal_code ?? undefined,
                    /**
                     * @todo: figure out why `country` is non-nullable here
                     */
                    country: currentBillingDetails.address?.country!,
                  },
                },
              }}
              onChange={(event) => {
                if (event.complete) {
                  // Extract potentially complete address
                  const { name, address } = event.value;

                  setUpdatedBillingDetails({
                    name,
                    address: {
                      ...address,
                      line2: address.line2 ?? undefined,
                    },
                  });

                  setIsComplete(true);
                } else {
                  setIsComplete(false);
                }
              }}
            />

            <Button
              size="small"
              squared
              type="submit"
              sx={{ marginTop: 3 }}
              loading={updatingBillingDetails}
              disabled={updatingBillingDetails || !isComplete}
            >
              Update billing information
            </Button>
          </Box>
        ) : null}
      </Elements>
    </>
  );
};
