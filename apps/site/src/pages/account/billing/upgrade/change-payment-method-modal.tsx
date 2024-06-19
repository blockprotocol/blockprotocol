import {
  faArrowRight,
  faCheck,
  faEdit,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Collapse,
  Divider,
  Fade,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  FormEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Stripe from "stripe";

import { Button } from "../../../../components/button";
import { FontAwesomeIcon } from "../../../../components/icons";
import { Link } from "../../../../components/link";
import { Modal } from "../../../../components/modal/modal";
import { internalApi } from "../../../../lib/internal-api-client";
import { AddPaymentMethod } from "../../billing-panel/add-payment-method-form";
import { cardDetailsPanelPageAsPath } from "../../billing-panel/card-details-panel-page";
import { PaymentMethod } from "../../billing-panel/payment-method";

type ChangePaymentMethodModalProps = {
  subscription: Stripe.Subscription;
  refetchSubscription: () => Promise<void>;
  paymentMethods: Stripe.PaymentMethod[];
  refetchPaymentMethods: () => Promise<void>;
  open: boolean;
  onClose: () => void;
};

export const ChangePaymentMethodModal: FunctionComponent<
  ChangePaymentMethodModalProps
> = ({
  open,
  onClose,
  subscription,
  refetchSubscription,
  paymentMethods,
  refetchPaymentMethods,
}) => {
  const [savingCardChoice, setSavingCardChoice] = useState<boolean>(false);

  const [updatedDefaultPaymentMethodId, setUpdatedDefaultPaymentMethodId] =
    useState<string>();

  useEffect(() => {
    setUpdatedDefaultPaymentMethodId(undefined);
  }, [open]);

  const [addingPaymentMethod, setAddingPaymentMethod] =
    useState<boolean>(false);

  const currentDefaultPaymentMethodId = useMemo(
    () =>
      typeof subscription.default_payment_method === "object"
        ? subscription.default_payment_method?.id
        : subscription.default_payment_method,
    [subscription],
  );

  const [animating, setAnimating] = useState(false);

  const handleSaveCard = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      setSavingCardChoice(true);

      if (
        updatedDefaultPaymentMethodId &&
        updatedDefaultPaymentMethodId !== currentDefaultPaymentMethodId
      ) {
        await internalApi.updateSubscriptionDefaultPaymentMethod({
          updatedDefaultPaymentMethodId,
        });

        await refetchSubscription();
      }

      setSavingCardChoice(false);

      onClose();
    },
    [
      updatedDefaultPaymentMethodId,
      currentDefaultPaymentMethodId,
      refetchSubscription,
      onClose,
    ],
  );

  const handlePaymentMethodAdded = useCallback(
    (params: { paymentMethodId: string }) => {
      setAddingPaymentMethod(false);
      setUpdatedDefaultPaymentMethodId(params.paymentMethodId);

      void refetchPaymentMethods();
    },
    [refetchPaymentMethods],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      contentStyle={{
        top: "40%",
      }}
      data-testid="change-payment-method-modal"
    >
      <Box>
        <Typography variant="bpHeading4" sx={{ marginBottom: 3 }}>
          Change payment method
        </Typography>
        <Typography variant="bpBodyCopy" sx={{ textTransform: "uppercase" }}>
          <strong>Payment Cards</strong>
        </Typography>
        {paymentMethods?.map((paymentMethod) => {
          const isDefault = currentDefaultPaymentMethodId === paymentMethod.id;

          const isChosen = updatedDefaultPaymentMethodId
            ? updatedDefaultPaymentMethodId === paymentMethod.id
            : isDefault;

          return (
            <Button
              key={paymentMethod.id}
              variant="transparent"
              onClick={() =>
                setUpdatedDefaultPaymentMethodId(
                  isDefault ? undefined : paymentMethod.id,
                )
              }
              sx={({ palette, spacing, transitions }) => ({
                display: "block",
                textAlign: "start",
                width: "100%",
                padding: spacing(0, 1),
                "& svg.card-logo-icon": {
                  transition: transitions.create("color"),
                },
                ":hover": {
                  background: palette.purple[10],
                  "& svg.card-logo-icon": {
                    color: palette.purple[50],
                  },
                  "& p.card-brand": {
                    color: palette.purple[70],
                  },
                  "& span.switch-text": {
                    opacity: 1,
                  },
                },
              })}
            >
              <PaymentMethod
                paymentMethod={paymentMethod}
                sx={{ marginY: 1 }}
                titleEndAdornment={
                  <Box component="span" position="relative">
                    <Fade in={isChosen}>
                      <Box
                        component="span"
                        sx={({ palette, spacing }) => ({
                          padding: spacing(0.5, 0.75),
                          color: palette.purple[700],
                          background: palette.purple[20],
                          borderRadius: 1,
                          textTransform: "uppercase",
                          fontSize: 11,
                        })}
                      >
                        <FontAwesomeIcon
                          icon={faCheck}
                          sx={{ marginRight: 0.75, fontSize: 12 }}
                        />
                        <strong>Chosen</strong>
                      </Box>
                    </Fade>
                    {isChosen ? null : (
                      <Box
                        component="span"
                        className="switch-text"
                        sx={{
                          position: "absolute",
                          left: 0,
                          top: 3,
                          textTransform: "uppercase",
                          fontSize: 11,
                          fontWeight: 600,
                          opacity: 0,
                          transition: ({ transitions }) =>
                            transitions.create("opacity"),
                        }}
                      >
                        Switch
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          sx={{
                            marginLeft: 0.75,
                            fontSize: 12,
                            position: "relative",
                            top: -1,
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                }
                endAdornment={
                  <Link
                    href={{
                      pathname: cardDetailsPanelPageAsPath,
                      query: { id: paymentMethod.id },
                    }}
                  >
                    <Tooltip title="Change card details">
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                        sx={{
                          "& svg": {
                            color: ({ palette }) => palette.gray[40],
                          },
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          sx={{ marginRight: 0.75, fontSize: 12 }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Link>
                }
              />
            </Button>
          );
        })}
        <Box marginBottom={4}>
          <Collapse
            in={addingPaymentMethod && !animating}
            onExited={() => setAnimating(false)}
          >
            <Box>
              <Divider
                sx={{
                  borderColor: ({ palette }) => palette.gray[20],
                  marginBottom: 2,
                }}
              />
              <AddPaymentMethod
                onCancel={() => {
                  setAnimating(true);
                  setAddingPaymentMethod(false);
                }}
                onPaymentMethodAdded={handlePaymentMethodAdded}
              />
            </Box>
          </Collapse>
          <Collapse
            in={!addingPaymentMethod && !animating}
            onExited={() => setAnimating(false)}
          >
            <Button
              onClick={() => {
                setAnimating(true);
                setAddingPaymentMethod(true);
              }}
              endIcon={<FontAwesomeIcon icon={faPlus} />}
              squared
              size="small"
              sx={{ marginTop: 1, padding: ({ spacing }) => spacing(1, 2) }}
              variant="secondary"
            >
              Add another card
            </Button>
          </Collapse>
        </Box>
        <Button
          size="small"
          squared
          endIcon={<FontAwesomeIcon icon={faCheck} />}
          sx={{ width: "100%" }}
          onClick={handleSaveCard}
          loading={savingCardChoice}
        >
          Save card choice
        </Button>
      </Box>
    </Modal>
  );
};
