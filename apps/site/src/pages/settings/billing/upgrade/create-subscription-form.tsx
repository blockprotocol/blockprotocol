import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Box, Collapse, Typography } from "@mui/material";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { PaymentIntent, StripeCardElementChangeEvent } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import {
  FormEvent,
  FunctionComponent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import { Button } from "../../../../components/button";
import { FontAwesomeIcon } from "../../../../components/icons";
import { useUser } from "../../../../context/user-context";
import { FRONTEND_URL } from "../../../../lib/config";
import { priceToHumanReadable } from "../../../shared/subscription-utils";

export const CreateSubscriptionCheckoutForm: FunctionComponent<{
  clientSecret?: string;
}> = ({ clientSecret }) => {
  const { refetch } = useUser();

  const router = useRouter();

  const stripe = useStripe();
  const elements = useElements();

  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent>();
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(true);
  const [isProcessingPayment, setIsProcessingPayment] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>();

  useEffect(() => {
    if (stripe && clientSecret) {
      void stripe
        .retrievePaymentIntent(clientSecret)
        .then((paymentIntentResult) => {
          if (paymentIntentResult.paymentIntent) {
            setPaymentIntent(paymentIntentResult.paymentIntent);
          } else if (paymentIntentResult.error) {
            setErrorMessage(paymentIntentResult.error.message);
          }
        });
    }
  }, [stripe, clientSecret]);

  const handleChange = async (event: StripeCardElementChangeEvent) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setIsFormDisabled(event.empty);
    setErrorMessage(event.error ? event.error.message : "");
  };

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      // We don't want to let default form submission happen here,
      // which would refresh the page.
      event.preventDefault();

      if (!stripe || !elements || !clientSecret) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }

      const stripeCardElement = elements.getElement(CardElement);

      if (!stripeCardElement) {
        throw new Error("The stripe card element is not defined.");
      }

      setIsProcessingPayment(true);

      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: stripeCardElement,
        },
        return_url: `${FRONTEND_URL}/settings/billing`,
      });

      setIsProcessingPayment(false);

      if (payload.error) {
        setErrorMessage(`Payment failed ${payload.error.message}`);
      } else {
        setErrorMessage(undefined);
        void refetch().then(() => router.push("/settings/billing"));
      }
    },
    [elements, stripe, refetch, clientSecret, router],
  );

  return (
    <>
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <Typography variant="bpSmallCopy" component="p">
          <strong>Due today</strong>
        </Typography>
        <Typography gutterBottom>
          {paymentIntent
            ? priceToHumanReadable({
                amountInCents: paymentIntent.amount,
                currency: paymentIntent.currency,
              })
            : ""}
        </Typography>
      </Box>
      <Typography gutterBottom variant="bpSmallCopy" component="p">
        <strong>Card details</strong>
      </Typography>
      <form onSubmit={handleSubmit}>
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
            sx={{ color: ({ palette }) => palette.red[800] }}
          >
            {errorMessage}
          </Typography>
        </Collapse>
        <Button
          type="submit"
          disabled={!stripe || isFormDisabled}
          squared
          fullWidth
          endIcon={<FontAwesomeIcon icon={faArrowRight} />}
          sx={{ marginBottom: 2 }}
          loading={isProcessingPayment}
        >
          Upgrade my account
        </Button>
      </form>
    </>
  );
};
