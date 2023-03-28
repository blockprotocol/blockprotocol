import {
  faArrowRight,
  faCaretRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  ErrorInfo,
  Status as InternalApiStatus,
  SubscriptionTierPrices,
} from "@local/internal-api-client";
import {
  Box,
  Collapse,
  Grid,
  Paper,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { AxiosError } from "axios";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import Stripe from "stripe";

import { Button } from "../../../../components/button";
import { FontAwesomeIcon } from "../../../../components/icons";
import { CoinsIcon } from "../../../../components/icons/coins-icon";
import { FlaskVialIcon } from "../../../../components/icons/flask-vial-icon";
import { HandIcon } from "../../../../components/icons/hand-icon";
import { JetFighterUpIcon } from "../../../../components/icons/jet-fighter-up-icon";
import { LockIcon } from "../../../../components/icons/lock-icon";
import { TrophyStarIcon } from "../../../../components/icons/trophy-star-icon";
import { Link } from "../../../../components/link";
import {
  AuthWallPageContent,
  withAuthWall,
} from "../../../../components/pages/auth-wall";
import { UserAvatar } from "../../../../components/user-avatar";
import { useUser } from "../../../../context/user-context";
import { internalApi } from "../../../../lib/internal-api-client";
import {
  createStripeOptions,
  isPaidSubscriptionTier,
  PaidSubscriptionTier,
  priceToHumanReadable,
  subscriptionTierToHumanReadable,
} from "../../../shared/subscription-utils";
import { paidSubscriptionFeatures } from "../../billing-settings-panel/free-or-hobby-subscription-tier-overview";
import { proSubscriptionFeatures } from "../../billing-settings-panel/pro-subscription-tier-overview";
import { SubscriptionFeatureListItem } from "../../billing-settings-panel/subscription-feature-list-item";
import { ChangePaymentMethodModal } from "./change-payment-method-modal";
import { CreateSubscriptionCheckoutForm } from "./create-subscription-form";
import { UpgradeExistingPaidSubscriptionIntro } from "./upgrade-existing-paid-subscription-intro";
import { UpgradePageLayout } from "./upgrade-page-layout";

type StripeErrorInfo = ErrorInfo & {
  domain: "stripe";
  metadata: {
    invoiceId: string;
    stripeDeclineCode: string;
    message: string;
  };
};

const isStatusContentStripeErrorInfo = (
  content: NonNullable<InternalApiStatus["contents"]>[number],
): content is StripeErrorInfo =>
  "domain" in content && content.domain === "stripe";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_API_KEY ?? "",
);

type UpgradePageProps = {
  stringifiedSubscriptionTierPrices: string;
};

export const getStaticProps: GetStaticProps<UpgradePageProps> = async () => {
  const { data } = await internalApi.getSubscriptionTierPrices().catch(() => ({
    data: null,
  }));

  return {
    props: {
      stringifiedSubscriptionTierPrices: JSON.stringify(
        data?.subscriptionTierPrices ?? null,
      ),
    },
    revalidate: 10,
  };
};

const UpgradePage: AuthWallPageContent<UpgradePageProps> = ({
  user,
  stringifiedSubscriptionTierPrices,
}) => {
  const router = useRouter();
  const { setUser } = useUser();

  const initialSubscriptionTierPrices = useMemo(
    () =>
      (JSON.parse(
        stringifiedSubscriptionTierPrices,
      ) as SubscriptionTierPrices | null) ?? undefined,
    [stringifiedSubscriptionTierPrices],
  );

  const [clientSecret, setClientSecret] = useState<string>();
  const [
    upgradeExistingPaidSubscriptionErrorMessage,
    setUpgradeExistingPaidSubscriptionErrorMessage,
  ] = useState<ReactNode>();

  const [subscriptionTierPrices, setSubscriptionTierPrices] = useState<
    SubscriptionTierPrices | undefined
  >(initialSubscriptionTierPrices ?? undefined);

  const fetchSubscriptionTierPrices = useCallback(async () => {
    const { data } = await internalApi.getSubscriptionTierPrices();
    setSubscriptionTierPrices(data.subscriptionTierPrices);
  }, []);

  useEffect(() => {
    if (!initialSubscriptionTierPrices && !subscriptionTierPrices) {
      void fetchSubscriptionTierPrices();
    }
  }, [
    initialSubscriptionTierPrices,
    subscriptionTierPrices,
    fetchSubscriptionTierPrices,
  ]);

  // State used when upgrading from an existing subscription
  const [isUpgradingSubscription, setIsUpgradingSubscription] =
    useState<boolean>(false);

  const [subscription, setSubscription] = useState<Stripe.Subscription>();

  const fetchSubscription = useCallback(async () => {
    const {
      data: { subscription: fetchedSubscription },
    } = await internalApi
      .getSubscription()
      .catch(() => ({ data: { subscription: undefined } }));

    setSubscription(fetchedSubscription);
  }, []);

  const [paymentMethods, setPaymentMethods] =
    useState<Stripe.PaymentMethod[]>();

  const fetchPaymentMethods = useCallback(async () => {
    const {
      data: { paymentMethods: fetchedPaymentMethods },
    } = await internalApi
      .getPaymentMethods()
      .catch(() => ({ data: { paymentMethods: [] } }));

    setPaymentMethods(fetchedPaymentMethods);
  }, []);

  const [taxRate, setTaxRate] = useState<number>();

  const fetchTaxRate = useCallback(async () => {
    const {
      data: { taxRate: fetchedTaxRate },
    } = await internalApi.getTaxRate();

    setTaxRate(fetchedTaxRate);
  }, []);

  const [changePaymentMethodModalOpen, setChangePaymentMethodModalOpen] =
    useState<boolean>(false);

  const { stripeSubscriptionTier: currentSubscriptionTier } = user;

  useEffect(() => {
    /**
     * If the user already has a "pro" subscription tier, they cannot upgrade
     * their account further, so they are redirected to the "billing" page.
     */
    if (currentSubscriptionTier === "pro") {
      void router.push("/settings/billing");
    }
  });

  const upgradedSubscriptionTier = useMemo<
    PaidSubscriptionTier | undefined
  >(() => {
    if (router.isReady) {
      const { query } = router;

      if (
        typeof query.tier === "string" &&
        isPaidSubscriptionTier(query.tier) &&
        currentSubscriptionTier !== query.tier
      ) {
        return query.tier;
      } else if (currentSubscriptionTier === "free") {
        return "hobby";
      } else if (currentSubscriptionTier === "hobby") {
        return "pro";
      }
    }
  }, [router, currentSubscriptionTier]);

  const userHasActiveStripeSubscription =
    user.stripeSubscriptionStatus === "active";

  useEffect(() => {
    if (userHasActiveStripeSubscription) {
      void fetchPaymentMethods();
      void fetchSubscription();
      void fetchTaxRate();
    }
  }, [
    userHasActiveStripeSubscription,
    fetchPaymentMethods,
    fetchSubscription,
    fetchTaxRate,
  ]);

  const theme = useTheme();

  const stripeElementsOptions = useMemo<StripeElementsOptions>(
    () => createStripeOptions({ clientSecret, theme }),
    [clientSecret, theme],
  );

  const createSubscription = async (params: { tier: PaidSubscriptionTier }) => {
    const { data } = await internalApi.createSubscription({
      subscriptionTier: params.tier,
    });

    setClientSecret(data.clientSecret);
  };

  useEffect(() => {
    if (upgradedSubscriptionTier && !userHasActiveStripeSubscription) {
      void createSubscription({ tier: upgradedSubscriptionTier });
    }
  }, [
    currentSubscriptionTier,
    upgradedSubscriptionTier,
    userHasActiveStripeSubscription,
  ]);

  const handleUpgradedSubscription = useCallback(() => {
    if (!upgradedSubscriptionTier) {
      return;
    }

    /**
     * The BP user in the database is updated by the stripe webhook in the
     * internal API. To reflect the updated state of the user before this
     * db write has taken place, we can manually update the user object
     * client-side with the anticipated values for `stripeSubscriptionStatus`
     * and `stripeSubscriptionTier`.
     */
    setUser((prevUser) => {
      if (typeof prevUser !== "object") {
        return prevUser;
      }

      return {
        ...prevUser,
        stripeSubscriptionStatus: "active",
        stripeSubscriptionTier: upgradedSubscriptionTier,
      };
    });

    void router.push("/settings/billing");
  }, [setUser, router, upgradedSubscriptionTier]);

  const upgradeSubscription = async (params: {
    tier: Exclude<PaidSubscriptionTier, "hobby">;
  }) => {
    setIsUpgradingSubscription(true);
    setUpgradeExistingPaidSubscriptionErrorMessage("");

    const {
      data: { updatedSubscription },
    } = await internalApi
      .updateSubscriptionTier({
        updatedSubscriptionTier: params.tier,
      })
      .catch((axiosError: AxiosError<InternalApiStatus>) => {
        const { response } = axiosError;

        const stripeErrorInfo = response?.data.contents.find(
          isStatusContentStripeErrorInfo,
        );

        if (stripeErrorInfo) {
          const {
            metadata: { message },
          } = stripeErrorInfo;

          setUpgradeExistingPaidSubscriptionErrorMessage(message);

          return { data: { updatedSubscription: undefined } };
        }
        throw axiosError;
      });

    setIsUpgradingSubscription(false);

    if (updatedSubscription) {
      handleUpgradedSubscription();
    }
  };

  const defaultPaymentMethod = useMemo(
    () =>
      paymentMethods?.find(({ id }) => {
        const defaultPaymentMethodId =
          typeof subscription?.default_payment_method === "object"
            ? subscription?.default_payment_method?.id
            : subscription?.default_payment_method;

        return id === defaultPaymentMethodId;
      }),
    [paymentMethods, subscription],
  );

  return (
    <>
      {userHasActiveStripeSubscription && subscription && paymentMethods ? (
        <ChangePaymentMethodModal
          subscription={subscription}
          refetchSubscription={fetchSubscription}
          paymentMethods={paymentMethods}
          refetchPaymentMethods={fetchPaymentMethods}
          open={changePaymentMethodModalOpen}
          onClose={() => setChangePaymentMethodModalOpen(false)}
        />
      ) : null}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexGrow={1}
      >
        <Paper
          elevation={4}
          sx={{
            borderRadius: "8px",
            padding: { xs: 2, md: 6 },
          }}
        >
          <Box>
            <Grid container spacing={6}>
              <Grid item sm={12} md={6} display="flex" flexDirection="column">
                <Box
                  sx={({ palette, spacing }) => ({
                    backgroundColor: palette.gray[10],
                    borderColor: palette.gray[20],
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderRadius: 4,
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
                    padding: {
                      xs: 2,
                      md: spacing(4, 6),
                    },
                  })}
                >
                  <Box display="flex" alignItems="center">
                    <Typography
                      variant="bpBodyCopy"
                      sx={{ color: ({ palette }) => palette.gray[80] }}
                    >
                      <strong>
                        {currentSubscriptionTier === "free" ? (
                          "Upgrading to "
                        ) : (
                          <>
                            Upgrading from{" "}
                            <Box
                              component="span"
                              sx={{
                                color: ({ palette }) => palette.common.black,
                              }}
                            >
                              {subscriptionTierToHumanReadable(
                                currentSubscriptionTier,
                              )}
                            </Box>{" "}
                            to{" "}
                          </>
                        )}
                        <Box
                          component="span"
                          sx={{
                            color: ({ palette }) => palette.common.black,
                          }}
                        >
                          {upgradedSubscriptionTier
                            ? subscriptionTierToHumanReadable(
                                upgradedSubscriptionTier,
                              )
                            : undefined}
                        </Box>
                      </strong>
                    </Typography>
                    <FontAwesomeIcon
                      icon={faCheck}
                      sx={{
                        marginLeft: 1,
                        color: ({ palette }) => palette.gray[80],
                      }}
                    />
                  </Box>
                  <Typography variant="bpSmallCopy" component="p">
                    Includes access to premium APIs from providers such as
                    OpenAI and Mapbox
                  </Typography>
                </Box>
                <Box
                  sx={({ palette, spacing }) => ({
                    backgroundColor: palette.purple[10],
                    padding: {
                      xs: 2,
                      md: spacing(4, 6),
                    },
                    paddingBottom: 2,
                    borderColor: palette.gray[20],
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderTopWidth: 0,
                  })}
                >
                  <Typography variant="bpBodyCopy" sx={{ fontSize: 32 }}>
                    <strong>
                      {upgradedSubscriptionTier && subscriptionTierPrices
                        ? priceToHumanReadable({
                            amountInCents:
                              subscriptionTierPrices[upgradedSubscriptionTier]
                                .unit_amount!,
                            currency:
                              subscriptionTierPrices[upgradedSubscriptionTier]
                                .currency,
                            decimalPlaces: 0,
                          })
                        : ""}
                    </strong>
                    /month
                  </Typography>
                  <Typography
                    variant="bpSmallCopy"
                    component="p"
                    sx={{ color: ({ palette }) => palette.purple[50] }}
                  >
                    {upgradedSubscriptionTier === "hobby"
                      ? "Best for casual users of blocks"
                      : "Best for embedders, devs and power users of blocks"}
                  </Typography>
                </Box>
                <Box
                  sx={({ palette, spacing }) => ({
                    backgroundColor: palette.purple[10],
                    padding: {
                      xs: 2,
                      md: spacing(4, 6),
                    },
                    borderColor: palette.gray[20],
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderTopWidth: 0,
                  })}
                >
                  <Typography
                    gutterBottom
                    component="p"
                    variant="bpSmallCopy"
                    sx={({ palette }) => ({
                      color: palette.purple[80],
                      mb: 1.5,
                    })}
                  >
                    <strong>Includes the following each month:</strong>
                  </Typography>
                  <Box
                    component="ul"
                    display="flex"
                    flexDirection="column"
                    marginBottom={3}
                    gap={1.5}
                  >
                    {(upgradedSubscriptionTier === "hobby"
                      ? paidSubscriptionFeatures.hobby.coreFeatures
                      : proSubscriptionFeatures["api-access"]
                    ).map((feature, index) => (
                      <SubscriptionFeatureListItem
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        feature={feature}
                      />
                    ))}
                  </Box>
                  {upgradedSubscriptionTier === "hobby" ? (
                    <Link href="/pricing">
                      <Typography
                        component="p"
                        variant="bpSmallCopy"
                        sx={({ palette, transitions }) => ({
                          color: palette.purple[80],
                          textTransform: "uppercase",
                          transition: transitions.create("opacity"),
                          "&:hover": {
                            opacity: 0.8,
                            "& svg": {
                              marginLeft: 1,
                            },
                          },
                        })}
                      >
                        <strong>View full plan details</strong>
                        <FontAwesomeIcon
                          icon={faCaretRight}
                          sx={{
                            position: "relative",
                            top: -1,
                            marginLeft: 0.5,
                            transition: ({ transitions }) =>
                              transitions.create("margin-left"),
                          }}
                        />
                      </Typography>
                    </Link>
                  ) : null}
                </Box>
                <Box
                  sx={({ palette, spacing }) => ({
                    padding: {
                      xs: 2,
                      md: spacing(4, 6),
                    },
                    borderColor: palette.gray[20],
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderTopWidth: 0,
                    borderRadius: 4,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    flexGrow: 1,
                  })}
                >
                  <Typography
                    gutterBottom
                    component="p"
                    variant="bpSmallCopy"
                    mb={1.5}
                  >
                    <strong>As well as:</strong>
                  </Typography>
                  <Box
                    display="flex"
                    flexDirection="column"
                    component="ul"
                    sx={{
                      marginBottom: {
                        xs: 0,
                        md: 4,
                      },
                    }}
                    gap={1.5}
                  >
                    {(upgradedSubscriptionTier === "hobby"
                      ? paidSubscriptionFeatures.hobby.additionalFeatures
                      : [
                          {
                            icon: <TrophyStarIcon sx={{ fontSize: 18 }} />,
                            title: (
                              <>
                                2x profile badges{" "}
                                <strong>exclusive to early Þ supporters</strong>
                              </>
                            ),
                          },
                          {
                            icon: <LockIcon sx={{ fontSize: 18 }} />,
                            title: (
                              <>
                                <strong>Private</strong> blocks and types
                              </>
                            ),
                            planned: true,
                          },
                          {
                            icon: <JetFighterUpIcon sx={{ fontSize: 18 }} />,
                            title: (
                              <>
                                <strong>Bonus</strong> features, updates and
                                special event invites
                              </>
                            ),
                            planned: true,
                          },
                          {
                            icon: <FlaskVialIcon sx={{ fontSize: 18 }} />,
                            title: (
                              <>
                                <strong>Early-access</strong> to new APIs
                              </>
                            ),
                          },
                          {
                            icon: <CoinsIcon sx={{ fontSize: 18 }} />,
                            title: (
                              <>
                                <strong>Discounted access</strong> to additional
                                API calls beyond those already included
                              </>
                            ),
                          },
                          {
                            icon: <HandIcon sx={{ fontSize: 18 }} />,
                            title: (
                              <>
                                Ability to <strong>prevent or cap</strong>{" "}
                                additional API use
                              </>
                            ),
                          },
                        ]
                    ).map((feature, index) => (
                      <SubscriptionFeatureListItem
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        feature={feature}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
              <Grid
                item
                sm={12}
                md={6}
                sx={{
                  display: "flex",
                }}
              >
                <Box sx={{ paddingY: 4 }}>
                  <Typography
                    variant="bpHeading4"
                    sx={{ fontWeight: 400, marginBottom: 4 }}
                  >
                    Upgrade Summary
                  </Typography>
                  <Box display="flex" alignItems="center" marginBottom={2}>
                    <UserAvatar user={user} size={50} />
                    <Box marginLeft={2}>
                      <Typography
                        variant="bpSmallCopy"
                        component="p"
                        sx={{ "& a": { borderBottomWidth: 0 } }}
                      >
                        <strong>{user.preferredName}</strong> (
                        <Link href={`/@${user.shortname}`}>
                          @{user.shortname}
                        </Link>
                        )
                      </Typography>
                      <Typography
                        variant="bpSmallCopy"
                        component="p"
                        sx={{
                          fontSize: 14,
                          color: ({ palette }) => palette.gray["60"],
                        }}
                      >
                        The account you're upgrading
                      </Typography>
                    </Box>
                  </Box>

                  {userHasActiveStripeSubscription ? (
                    <>
                      <UpgradeExistingPaidSubscriptionIntro
                        currentSubscriptionTier={
                          currentSubscriptionTier as "hobby"
                        }
                        upgradedSubscriptionTier={upgradedSubscriptionTier}
                        subscriptionTierPrices={subscriptionTierPrices}
                        taxRate={taxRate}
                        defaultPaymentMethod={defaultPaymentMethod}
                        onChangePaymentMethod={() =>
                          setChangePaymentMethodModalOpen(true)
                        }
                      />
                      <Collapse
                        in={!!upgradeExistingPaidSubscriptionErrorMessage}
                        sx={{ marginBottom: 4 }}
                      >
                        <Typography
                          variant="bpSmallCopy"
                          sx={{
                            color: ({ palette }) => palette.error.main,
                          }}
                        >
                          {upgradeExistingPaidSubscriptionErrorMessage}
                        </Typography>
                      </Collapse>
                    </>
                  ) : null}
                  <Box marginBottom={4}>
                    {userHasActiveStripeSubscription ? (
                      upgradedSubscriptionTier ? (
                        <Button
                          fullWidth
                          squared
                          onClick={() =>
                            upgradeSubscription({
                              tier: upgradedSubscriptionTier as "pro",
                            })
                          }
                          endIcon={<FontAwesomeIcon icon={faArrowRight} />}
                          loading={isUpgradingSubscription}
                        >
                          Upgrade my account and continue
                        </Button>
                      ) : null
                    ) : stripeElementsOptions.clientSecret ? (
                      <Elements
                        stripe={stripePromise}
                        options={stripeElementsOptions}
                      >
                        <CreateSubscriptionCheckoutForm
                          upgradedSubscriptionTier={upgradedSubscriptionTier}
                          subscriptionTierPrices={subscriptionTierPrices}
                          onCompleted={handleUpgradedSubscription}
                          clientSecret={clientSecret}
                        />
                      </Elements>
                    ) : (
                      <>
                        <Skeleton height={20} />
                        <Skeleton height={18} width={80} />
                        <Skeleton height={40} />
                        <Skeleton height={51} />
                      </>
                    )}
                  </Box>
                  <Typography
                    variant="bpSmallCopy"
                    component="p"
                    sx={({ palette, transitions }) => ({
                      marginBottom: 2,
                      fontSize: 14,
                      color: "#464852",
                      "& a": {
                        color: palette.purple[70],
                        borderColor: "transparent",
                        transition: transitions.create("border-color"),
                      },
                    })}
                  >
                    By clicking “Upgrade my account and continue”, you agree to
                    our{" "}
                    <Link href="/legal/terms" target="_blank">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/legal/privacy" target="_blank">
                      Privacy Statement
                    </Link>
                    .
                  </Typography>
                  {currentSubscriptionTier === "free" ? (
                    <Typography
                      variant="bpSmallCopy"
                      component="p"
                      sx={({ palette }) => ({
                        fontSize: 14,
                        color: palette.gray[60],
                        "& code": {
                          color: palette.gray[80],
                        },
                      })}
                    >
                      The charge will appear on your card statement as either{" "}
                      <code>BLOCKPROTO</code> or <code>BLOCKPROTOCOL.ORG</code>{" "}
                      depending on your payment provider. You will be billed
                      every 30 days, until you cancel.
                    </Typography>
                  ) : (
                    <>
                      <Typography
                        variant="bpSmallCopy"
                        component="p"
                        sx={{
                          marginBottom: 2,
                          fontSize: 14,
                          color: ({ palette }) => palette.gray[70],
                        }}
                      >
                        You will immediately receive the number of credits equal
                        to the difference between those included in the Hobby
                        and Pro plans.
                      </Typography>
                      <Typography
                        variant="bpSmallCopy"
                        component="p"
                        sx={{
                          fontSize: 14,
                          color: ({ palette }) => palette.gray[70],
                        }}
                      >
                        Your new{" "}
                        <strong>
                          {upgradedSubscriptionTier
                            ? subscriptionTierToHumanReadable(
                                upgradedSubscriptionTier,
                              )
                            : ""}
                        </strong>{" "}
                        discount on additional usage charges incurred takes
                        immediate effect. Additional use charges already accrued
                        are unaffected and will still be billed at the rate in
                        effect at that time.
                      </Typography>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

UpgradePage.getLayout = (page) => <UpgradePageLayout>{page}</UpgradePageLayout>;

export default withAuthWall(UpgradePage);
