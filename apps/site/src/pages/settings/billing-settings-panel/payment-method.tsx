import { Box, Typography } from "@mui/material";
import { FunctionComponent, useMemo } from "react";
import Stripe from "stripe";

import { cardBrandToHumanReadable } from "../../shared/subscription-utils";
import { CardLogoIcon } from "./card-logo-icon";

export const PaymentMethod: FunctionComponent<{
  paymentMethod: Stripe.PaymentMethod;
}> = ({ paymentMethod }) => {
  const humanReadableExpiryDate = useMemo(() => {
    if (!paymentMethod.card?.exp_month || !paymentMethod.card.exp_year) {
      return "";
    }
    const { exp_month, exp_year } = paymentMethod.card;

    return `${exp_month < 10 ? `0${exp_month}` : exp_month}/${exp_year}`;
  }, [paymentMethod]);

  return (
    <Box display="flex" alignItems="center" marginTop={2} marginBottom={2}>
      <CardLogoIcon
        cardBrand={paymentMethod.card?.brand}
        sx={{ fontSize: 36, color: ({ palette }) => palette.gray[40] }}
      />
      <Box marginLeft={2}>
        <Typography variant="bpMicroCopy" component="p">
          <strong>
            {paymentMethod.card?.brand
              ? cardBrandToHumanReadable(paymentMethod.card?.brand)
              : ""}
          </strong>
        </Typography>
        <Typography variant="bpMicroCopy" component="p">
          Ending <strong>*{paymentMethod.card?.last4}</strong> Expires{" "}
          <strong>{humanReadableExpiryDate}</strong>
        </Typography>
      </Box>
    </Box>
  );
};
