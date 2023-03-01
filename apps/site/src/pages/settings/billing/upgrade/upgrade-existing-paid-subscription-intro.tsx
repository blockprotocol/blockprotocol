import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { SubscriptionTierPrices } from "@local/internal-api-client";
import { Box, Tooltip, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import Stripe from "stripe";

import { Button } from "../../../../components/button";
import { FontAwesomeIcon } from "../../../../components/icons";
import { CircleInfoRegularIcon } from "../../../../components/icons/circle-info-regular";
import {
  cardBrandToHumanReadable,
  PaidSubscriptionTier,
  priceToHumanReadable,
} from "../../../shared/subscription-utils";

export const UpgradeExistingPaidSubscriptionIntro: FunctionComponent<{
  currentSubscriptionTier?: PaidSubscriptionTier;
  upgradedSubscriptionTier?: PaidSubscriptionTier;
  subscriptionTierPrices?: SubscriptionTierPrices;
  taxRate?: number;
  defaultPaymentMethod?: Stripe.PaymentMethod;
  onChangePaymentMethod: () => void;
}> = ({
  currentSubscriptionTier,
  upgradedSubscriptionTier,
  subscriptionTierPrices,
  taxRate,
  defaultPaymentMethod,
  onChangePaymentMethod,
}) => {
  const newMonthlySubscriptionPriceAmount =
    upgradedSubscriptionTier && subscriptionTierPrices
      ? subscriptionTierPrices[upgradedSubscriptionTier].unit_amount!
      : undefined;

  const newMonthlySubscriptionPriceCurrency =
    upgradedSubscriptionTier && subscriptionTierPrices
      ? subscriptionTierPrices[upgradedSubscriptionTier].currency
      : undefined;

  const newMonthlySubscriptionPriceAmountWithTax =
    typeof taxRate !== "undefined" &&
    typeof newMonthlySubscriptionPriceAmount !== "undefined"
      ? newMonthlySubscriptionPriceAmount +
        taxRate * newMonthlySubscriptionPriceAmount
      : undefined;

  const previousSubscriptionPriceAmount =
    subscriptionTierPrices && currentSubscriptionTier
      ? subscriptionTierPrices[currentSubscriptionTier].unit_amount!
      : undefined;

  const upgradeSubscriptionPriceAmount =
    typeof newMonthlySubscriptionPriceAmount !== "undefined" &&
    typeof previousSubscriptionPriceAmount !== "undefined"
      ? newMonthlySubscriptionPriceAmount - previousSubscriptionPriceAmount
      : undefined;

  const upgradeSubscriptionPriceAmountWithTax =
    typeof taxRate !== "undefined" &&
    typeof upgradeSubscriptionPriceAmount !== "undefined"
      ? upgradeSubscriptionPriceAmount +
        taxRate * upgradeSubscriptionPriceAmount
      : undefined;

  return (
    <>
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <Box>
          <Typography variant="bpSmallCopy" component="p">
            <strong>New monthly total</strong>
          </Typography>
          <Typography
            variant="bpSmallCopy"
            component="p"
            sx={{
              color: ({ palette }) => palette.gray["60"],
            }}
          >
            Base price you’ll pay going forward
          </Typography>
        </Box>
        <Box>
          <Typography variant="bpSmallCopy" component="p" textAlign="right">
            {typeof newMonthlySubscriptionPriceAmount !== "undefined" &&
            newMonthlySubscriptionPriceCurrency
              ? priceToHumanReadable({
                  amountInCents: newMonthlySubscriptionPriceAmount,
                  currency: newMonthlySubscriptionPriceCurrency,
                  decimalPlaces: 0,
                })
              : ""}{" "}
            /month
          </Typography>
          <Typography
            variant="bpSmallCopy"
            component="p"
            sx={{
              color: ({ palette }) => palette.gray["60"],
            }}
            textAlign="right"
          >
            {typeof newMonthlySubscriptionPriceAmountWithTax !== "undefined" &&
            newMonthlySubscriptionPriceCurrency
              ? `${priceToHumanReadable({
                  amountInCents: newMonthlySubscriptionPriceAmountWithTax,
                  currency: newMonthlySubscriptionPriceCurrency,
                })} inc. taxes`
              : ""}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <Box>
          <Typography variant="bpSmallCopy" component="p">
            <strong>Due today</strong>
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography
              variant="bpSmallCopy"
              component="p"
              sx={{
                color: ({ palette }) => palette.gray["60"],
              }}
            >
              Difference in price between your old and new plan
              <Tooltip
                placement="top"
                title="You will be allotted a full Pro credit allowance for the remainder of this billing period"
              >
                <Box component="span" sx={{ marginLeft: 1, cursor: "pointer" }}>
                  <CircleInfoRegularIcon
                    sx={{
                      width: 16,
                      color: ({ palette }) => palette.gray[60],
                    }}
                  />
                </Box>
              </Tooltip>
            </Typography>
          </Box>
        </Box>
        <Typography gutterBottom>
          {typeof upgradeSubscriptionPriceAmountWithTax !== "undefined" &&
          newMonthlySubscriptionPriceCurrency
            ? priceToHumanReadable({
                amountInCents: upgradeSubscriptionPriceAmountWithTax,
                currency: newMonthlySubscriptionPriceCurrency,
              })
            : ""}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="bpSmallCopy" component="p">
          <strong>Payment method</strong>
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography>
            {defaultPaymentMethod?.card?.brand
              ? cardBrandToHumanReadable(defaultPaymentMethod.card.brand)
              : "Card"}{" "}
            ending <strong>*{defaultPaymentMethod?.card?.last4}</strong>
          </Typography>
          <Button
            variant="transparent"
            sx={{
              textTransform: "uppercase",
              color: ({ palette }) => palette.purple[80],
              fontSize: 12,
              fontWeight: 800,
              marginLeft: 2,
            }}
            onClick={() => onChangePaymentMethod()}
            startIcon={<FontAwesomeIcon icon={faRotate} />}
          >
            Change
          </Button>
        </Box>
      </Box>
    </>
  );
};
