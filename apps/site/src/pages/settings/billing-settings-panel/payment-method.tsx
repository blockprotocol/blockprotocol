import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Box, Typography } from "@mui/material";
import { FunctionComponent, useMemo } from "react";
import Stripe from "stripe";

import { FontAwesomeIcon } from "../../../components/icons";
import { CircleExclamationRegularIcon } from "../../../components/icons/circle-exclamation-regular-icon";
import { cardBrandToHumanReadable } from "../../shared/subscription-utils";
import { CardLogoIcon } from "./card-logo-icon";

export const PaymentMethod: FunctionComponent<{
  paymentMethod: Stripe.PaymentMethod;
  isDefault?: boolean;
}> = ({ paymentMethod, isDefault }) => {
  const humanReadableExpiryDate = useMemo(() => {
    if (!paymentMethod.card?.exp_month || !paymentMethod.card.exp_year) {
      return "";
    }
    const { exp_month, exp_year } = paymentMethod.card;

    return `${exp_month < 10 ? `0${exp_month}` : exp_month}/${exp_year}`;
  }, [paymentMethod]);

  const isExpired = useMemo(() => {
    const date = new Date();

    if (
      paymentMethod.card?.exp_month &&
      paymentMethod.card?.exp_month &&
      paymentMethod.card.exp_month <= date.getMonth() + 1 &&
      paymentMethod.card.exp_year <= date.getFullYear()
    ) {
      return true;
    }
  }, [paymentMethod]);

  return (
    <Box display="flex" alignItems="center" marginTop={2} marginBottom={2}>
      <CardLogoIcon
        cardBrand={paymentMethod.card?.brand}
        sx={{ fontSize: 40, color: ({ palette }) => palette.gray[40] }}
      />
      <Box marginLeft={2}>
        <Typography
          variant="bpMicroCopy"
          component="p"
          sx={{ marginBottom: 1 }}
        >
          <strong>
            {paymentMethod.card?.brand
              ? cardBrandToHumanReadable(paymentMethod.card?.brand)
              : ""}
          </strong>
          {isDefault ? (
            <Box
              component="span"
              sx={({ palette, spacing }) => ({
                padding: spacing(0.5, 0.75),
                color: palette.purple[700],
                background: palette.purple[20],
                borderRadius: 1,
                textTransform: "uppercase",
                fontSize: 11,
                marginLeft: 1,
              })}
            >
              <FontAwesomeIcon
                icon={faCheck}
                sx={{ marginRight: 0.75, fontSize: 12 }}
              />
              <strong>Default</strong>
            </Box>
          ) : null}
          {isExpired ? (
            <Box
              component="span"
              sx={({ palette, spacing }) => ({
                padding: spacing(0.5, 0.75),
                color: palette.gray[70],
                background: palette.gray[10],
                borderRadius: 1,
                textTransform: "uppercase",
                fontSize: 11,
                marginLeft: 1,
              })}
            >
              <CircleExclamationRegularIcon
                sx={{ marginRight: 0.75, fontSize: 12 }}
              />
              <strong>Expired</strong>
            </Box>
          ) : null}
        </Typography>
        <Box display="flex">
          <Typography variant="bpMicroCopy" component="p">
            Ending <strong>*{paymentMethod.card?.last4}</strong>
          </Typography>
          <Typography
            variant="bpMicroCopy"
            component="p"
            sx={{ marginLeft: 1.5 }}
          >
            Expires <strong>{humanReadableExpiryDate}</strong>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
