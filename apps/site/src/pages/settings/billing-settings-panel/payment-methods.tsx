import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Box, Divider, Typography } from "@mui/material";
import { Fragment, FunctionComponent } from "react";

import { Button } from "../../../components/button";
import { FontAwesomeIcon } from "../../../components/icons";
import { useBillingPageContext } from "./billing-page-context";
import { PaymentMethod } from "./payment-method";

export const paymentMethodsPanelPageAsPath =
  "/settings/billing/payment-methods";

export const PaymentMethodsPanelPage: FunctionComponent = () => {
  const { paymentMethods } = useBillingPageContext();
  return (
    <>
      <Typography
        variant="bpBodyCopy"
        sx={{ color: ({ palette }) => palette.gray[90], marginBottom: 4 }}
      >
        Choose the default payment method to be used by your account
      </Typography>
      <Typography variant="bpBodyCopy" sx={{ textTransform: "uppercase" }}>
        <strong>Payment Cards</strong>
      </Typography>
      <Box maxWidth={400}>
        {paymentMethods?.map((paymentMethod, index) => (
          <Fragment key={paymentMethod.id}>
            <PaymentMethod paymentMethod={paymentMethod} />
            {index !== paymentMethods.length - 1 ? <Divider /> : null}
          </Fragment>
        ))}
      </Box>
      <Button endIcon={<FontAwesomeIcon icon={faPlus} />} squared>
        Add another card
      </Button>
    </>
  );
};
