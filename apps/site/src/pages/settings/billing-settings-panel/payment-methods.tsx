import { faEllipsis, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  CircularProgress,
  Collapse,
  Divider,
  Fade,
  IconButton,
  ListItemText,
  listItemTextClasses,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { bindMenu } from "material-ui-popup-state";
import { bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import {
  Fragment,
  FunctionComponent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import Stripe from "stripe";

import { Button } from "../../../components/button";
import { FontAwesomeIcon } from "../../../components/icons";
import { Link } from "../../../components/link";
import { internalApi } from "../../../lib/internal-api-client";
import { AddPaymentMethod } from "./add-payment-method-form";
import { useBillingPageContext } from "./billing-page-context";
import { cardDetailsPanelPageAsPath } from "./card-details-panel-page";
import { PaymentMethod } from "./payment-method";

export const paymentMethodsPanelPageAsPath =
  "/settings/billing/payment-methods";

const PaymentMethodMenu: FunctionComponent<{
  paymentMethod: Stripe.PaymentMethod;
  isDefault: boolean;
}> = ({ paymentMethod, isDefault }) => {
  const menuTriggerRef = useRef(null);

  const { refetchSubscription } = useBillingPageContext();

  const popupState = usePopupState({
    variant: "popover",
    popupId: `payment-method-${paymentMethod.id}`,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleMakeDefaultMethodClick = useCallback(async () => {
    setIsLoading(true);

    await internalApi.updateSubscription({
      updatedDefaultPaymentMethodId: paymentMethod.id,
    });

    await refetchSubscription?.();

    setIsLoading(false);

    void popupState.close();
  }, [paymentMethod, refetchSubscription, popupState]);

  const handleRemovePaymentMethodClick = useCallback(async () => {}, []);

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
    <Box>
      <Tooltip title="Open options menu" placement="right">
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
      </Tooltip>
      <Menu {...bindMenu(popupState)}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="bpMicroCopy"
            sx={{
              padding: 1.5,
              color: ({ palette }) => palette.gray[50],
              textTransform: "uppercase",
            }}
          >
            Actions
          </Typography>
          <Fade in={isLoading}>
            <CircularProgress
              size={18}
              thickness={5}
              sx={{
                color: ({ palette }) => palette.gray[50],
                marginRight: 1.5,
              }}
            />
          </Fade>
        </Box>
        {isExpired || isDefault ? null : (
          <MenuItem onClick={handleMakeDefaultMethodClick} disabled={isLoading}>
            <ListItemText primary="Make default method" />
          </MenuItem>
        )}
        <Link href={cardDetailsPanelPageAsPath}>
          <MenuItem disabled={isLoading}>
            <ListItemText primary="Change billing address" />
          </MenuItem>
        </Link>
        {isDefault ? null : (
          <MenuItem
            sx={({ palette }) => ({
              "&:hover": {
                [`.${listItemTextClasses.primary}`]: {
                  color: palette.red[80],
                },
              },
            })}
            onClick={handleRemovePaymentMethodClick}
            disabled={isLoading}
          >
            <ListItemText primary="Remove card" />
          </MenuItem>
        )}
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
        {paymentMethods?.map((paymentMethod, index) => {
          const isDefault =
            subscription?.default_payment_method === paymentMethod.id;

          return (
            <Fragment key={paymentMethod.id}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <PaymentMethod
                  paymentMethod={paymentMethod}
                  isDefault={isDefault}
                />
                <PaymentMethodMenu
                  paymentMethod={paymentMethod}
                  isDefault={isDefault}
                />
              </Box>
              {index !== paymentMethods.length - 1 ? (
                <Divider
                  sx={{ borderColor: ({ palette }) => palette.gray[20] }}
                />
              ) : null}
            </Fragment>
          );
        })}
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
            sx={{ marginTop: 1 }}
          >
            Add another card
          </Button>
        </Fade>
      </Box>
    </>
  );
};
