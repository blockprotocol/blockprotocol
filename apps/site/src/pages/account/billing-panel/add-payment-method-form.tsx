// Make sure to call `loadStripe` outside of a component’s render to avoid

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Box, Collapse, Typography, useTheme } from "@mui/material";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  loadStripe,
  StripeCardElementChangeEvent,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import {
  FormEvent,
  FunctionComponent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Button } from "../../../components/button";
import { FontAwesomeIcon } from "../../../components/icons";
import { FRONTEND_URL } from "../../../lib/config";
import { internalApi } from "../../../lib/internal-api-client";
import { createStripeOptions } from "../../shared/subscription-utils";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_API_KEY ?? "",
);

const AddPaymentMethodForm: FunctionComponent<{
  clientSecret?: string;
  onCancel: () => void;
  onPaymentMethodAdded: (params: { paymentMethodId: string }) => void;
}> = ({ onCancel, onPaymentMethodAdded, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<ReactNode>(null);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      // We don't want to let default form submission happen here,
      // which would refresh the page.
      event.preventDefault();

      const stripeCardElement = elements?.getElement(CardElement);

      if (!stripe || !elements || !clientSecret || !stripeCardElement) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }

      setIsLoading(true);

      const { setupIntent, error } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: { card: stripeCardElement },
          return_url: `${FRONTEND_URL}/account/billing/payment-methods`,
        },
      );

      setIsLoading(false);

      if (error) {
        setErrorMessage(error.message);
      } else {
        const paymentMethodId =
          typeof setupIntent.payment_method === "object"
            ? setupIntent.payment_method?.id
            : setupIntent.payment_method;

        if (!paymentMethodId) {
          throw new Error("Payment method id not returned.");
        }

        onPaymentMethodAdded({ paymentMethodId });
      }
    },
    [elements, stripe, clientSecret, onPaymentMethodAdded],
  );

  const handleCancel = () => {
    const stripeCardElement = elements?.getElement(CardElement);

    stripeCardElement?.clear();

    onCancel();
  };

  const handleChange = async (event: StripeCardElementChangeEvent) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setIsFormDisabled(event.empty);
    setErrorMessage(event.error ? event.error.message : "");
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box
        sx={{
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: ({ palette }) => palette.gray[20],
          padding: 1.5,
          borderRadius: 1.5,
          marginBottom: 1,
        }}
      >
        <CardElement onChange={handleChange} />
      </Box>
      <Collapse in={!!errorMessage} sx={{ marginBottom: 1 }}>
        <Typography
          variant="bpSmallCopy"
          sx={{ color: ({ palette }) => palette.error.main }}
        >
          {errorMessage}
        </Typography>
      </Collapse>
      <Box display="flex">
        <Button
          onClick={handleCancel}
          squared
          variant="secondary"
          size="small"
          sx={{ alignSelf: "stretch" }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isFormDisabled || !!errorMessage}
          squared
          sx={{ marginLeft: 1 }}
          size="small"
          endIcon={<FontAwesomeIcon icon={faPlus} />}
          loading={isLoading}
        >
          Add Payment Method
        </Button>
      </Box>
    </Box>
  );
};

export const AddPaymentMethod: FunctionComponent<{
  onCancel: () => void;
  onPaymentMethodAdded: (params: { paymentMethodId: string }) => void;
}> = ({ onCancel, onPaymentMethodAdded }) => {
  const [clientSecret, setClientSecret] = useState<string>();

  const createStripeSetupIntent = useCallback(async () => {
    const { data } = await internalApi.createStripeSetupIntent();

    setClientSecret(data.clientSecret);
  }, []);

  useEffect(() => {
    if (!clientSecret) {
      void createStripeSetupIntent();
    }
  }, [clientSecret, createStripeSetupIntent]);

  const theme = useTheme();

  const options = useMemo<StripeElementsOptions>(
    () =>
      createStripeOptions({
        clientSecret,
        theme,
      }),
    [clientSecret, theme],
  );

  if (!options.clientSecret) {
    return null;
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <AddPaymentMethodForm
        onCancel={onCancel}
        clientSecret={clientSecret}
        onPaymentMethodAdded={onPaymentMethodAdded}
      />
    </Elements>
  );
};
