import { faEllipsis, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Collapse,
  Divider,
  Fade,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { bindMenu } from "material-ui-popup-state";
import { bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import {
  Fragment,
  FunctionComponent,
  useCallback,
  useRef,
  useState,
} from "react";
import Stripe from "stripe";

import { Button } from "../../../components/button";
import { FontAwesomeIcon } from "../../../components/icons";
import { Link } from "../../../components/link";
import { AddPaymentMethod } from "./add-payment-method-form";
import { useBillingPageContext } from "./billing-page-context";
import { cardDetailsPanelPageAsPath } from "./card-details-panel-page";
import { PaymentMethod } from "./payment-method";

export const paymentMethodsPanelPageAsPath =
  "/settings/billing/payment-methods";

const PaymentMethodMenu: FunctionComponent<{
  paymentMethod: Stripe.PaymentMethod;
}> = ({ paymentMethod }) => {
  const menuTriggerRef = useRef(null);

  const popupState = usePopupState({
    variant: "popover",
    popupId: `payment-method-${paymentMethod.id}`,
  });

  return (
    <Box>
      <IconButton
        ref={menuTriggerRef}
        className="entity-menu-trigger"
        {...bindTrigger(popupState)}
        size="medium"
        sx={({ palette }) => ({
          padding: "4px",
          borderRadius: "4px",
          "&:focus-visible, &:hover": {
            backgroundColor: palette.gray[30],
            color: palette.gray[40],
          },
          "&:focus": {
            borderRadius: "4px",
          },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: palette.gray[50],
        })}
      >
        <FontAwesomeIcon icon={faEllipsis} />
      </IconButton>
      <Menu {...bindMenu(popupState)}>
        <Typography
          variant="bpMicroCopy"
          sx={{
            padding: 1.5,
            color: ({ palette }) => palette.gray[50],
            textTransform: "uppercase",
          }}
          padding={2}
        >
          Actions
        </Typography>
        <MenuItem>
          <ListItemText primary="Make default method" />
        </MenuItem>
        <Link href={cardDetailsPanelPageAsPath}>
          <MenuItem>
            <ListItemText primary="Change billing address" />
          </MenuItem>
        </Link>
        <MenuItem>
          <ListItemText primary="Remove card" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export const PaymentMethodsPanelPage: FunctionComponent = () => {
  const [addingPaymentMethod, setAddingPaymentMethod] =
    useState<boolean>(false);
  const { paymentMethods, subscription, refetchPaymentMethods } =
    useBillingPageContext();

  const handleAddAnotherCardClick = useCallback(() => {
    setAddingPaymentMethod(true);
  }, []);

  const handlePaymentMethodAdded = useCallback(() => {
    setAddingPaymentMethod(false);
    void refetchPaymentMethods?.();
  }, [refetchPaymentMethods]);

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
      <Box maxWidth={420} marginBottom={2}>
        {paymentMethods?.map((paymentMethod, index) => (
          <Fragment key={paymentMethod.id}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <PaymentMethod
                paymentMethod={paymentMethod}
                isDefault={
                  subscription?.default_payment_method === paymentMethod.id
                }
              />
              <PaymentMethodMenu paymentMethod={paymentMethod} />
            </Box>
            {index !== paymentMethods.length - 1 ? (
              <Divider
                sx={{ borderColor: ({ palette }) => palette.gray[20] }}
              />
            ) : null}
          </Fragment>
        ))}
        <Collapse in={addingPaymentMethod}>
          <Box>
            <Divider
              sx={{
                borderColor: ({ palette }) => palette.gray[20],
                marginBottom: 2,
              }}
            />
            <AddPaymentMethod
              onCancel={() => setAddingPaymentMethod(false)}
              onPaymentMethodAdded={handlePaymentMethodAdded}
            />
          </Box>
        </Collapse>
        <Fade in={!addingPaymentMethod}>
          <Button
            onClick={handleAddAnotherCardClick}
            endIcon={<FontAwesomeIcon icon={faPlus} />}
            squared
            size="small"
          >
            Add another card
          </Button>
        </Fade>
      </Box>
    </>
  );
};
