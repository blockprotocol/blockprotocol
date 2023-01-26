import {
  faArrowRight,
  faCaretRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { SubscriptionTierPrices } from "@local/internal-api-client";
import {
  Box,
  Container,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import Stripe from "stripe";

import { Button } from "../../../../components/button";
import { FontAwesomeIcon } from "../../../../components/icons";
import { CircleInfoRegularIcon } from "../../../../components/icons/circle-info-regular";
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
import {
  getDateFromStripeDate,
  internalApi,
} from "../../../../lib/internal-api-client";
import {
  dateToHumanReadable,
  isPaidSubscriptionTier,
  PaidSubscriptionTier,
  priceToHumanReadable,
  SubscriptionTier,
  subscriptionTierToHumanReadable,
} from "../../../shared/subscription-utils";
import { paidSubscriptionFeatures } from "../../billing-settings-panel/free-or-hobby-subscription-tier-overview";
import { proSubscriptionFeatures } from "../../billing-settings-panel/pro-subscription-tier-overview";
import { SubscriptionFeatureListItem } from "../../billing-settings-panel/subscription-feature-list-item";
import { CreateSubscriptionCheckoutForm } from "./create-subscription-form";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_API_KEY ?? "",
);

type UpgradePageProps = {
  subscriptionTierPrices: SubscriptionTierPrices;
};

export const getStaticProps: GetStaticProps<UpgradePageProps> = async () => {
  const {
    data: { subscriptionTierPrices },
  } = await internalApi.getSubscriptionTierPrices();

  return {
    props: {
      subscriptionTierPrices,
    },
  };
};

const UpgradePage: AuthWallPageContent<UpgradePageProps> = ({
  user,
  subscriptionTierPrices,
}) => {
  const router = useRouter();
  const { setUser } = useUser();

  const [subscriptionId, setSubscriptionId] = useState<string>();
  const [clientSecret, setClientSecret] = useState<string>();

  // State used when upgrading from an existing subscription
  const [subscription, setSubscription] = useState<Stripe.Subscription>();
  const [isUpgradingSubscription, setIsUpgradingSubscription] =
    useState<boolean>(false);

  const currentSubscriptionTier: SubscriptionTier =
    user.stripeSubscriptionStatus === "active"
      ? user.stripeSubscriptionTier ?? "free"
      : "free";

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

      if (query.tier) {
        void router.replace({ pathname: router.pathname }, undefined, {
          shallow: true,
        });
      }

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

  const fetchSubscription = useCallback(async () => {
    const { data } = await internalApi.getSubscription({});

    setSubscription(data.subscription);
  }, []);

  const isUpgradingExistingPaidSubscription = useMemo<boolean>(
    () =>
      !!upgradedSubscriptionTier &&
      isPaidSubscriptionTier(currentSubscriptionTier) &&
      currentSubscriptionTier !== upgradedSubscriptionTier,
    [currentSubscriptionTier, upgradedSubscriptionTier],
  );

  useEffect(() => {
    if (isUpgradingExistingPaidSubscription) {
      void fetchSubscription();
    }
  }, [isUpgradingExistingPaidSubscription, fetchSubscription]);

  const stripeElementsOptions = useMemo<StripeElementsOptions>(
    () => ({
      clientSecret,
    }),
    [clientSecret],
  );

  const createSubscription = async (params: { tier: PaidSubscriptionTier }) => {
    const { data } = await internalApi.createSubscription({
      subscriptionTier: params.tier,
    });

    setSubscriptionId(data.subscriptionId);
    setClientSecret(data.clientSecret);
  };

  useEffect(() => {
    if (upgradedSubscriptionTier && !subscriptionId) {
      if (currentSubscriptionTier === "free") {
        void createSubscription({ tier: upgradedSubscriptionTier });
      }
    }
  }, [currentSubscriptionTier, upgradedSubscriptionTier, subscriptionId]);

  const handleUpgradedSubscription = useCallback(() => {
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

    await internalApi.updateSubscription({
      updatedSubscriptionTier: params.tier,
    });

    setIsUpgradingSubscription(false);

    /** @todo: catch payment errors */

    handleUpgradedSubscription();
  };

  const _currentPeriodEnd = useMemo(() => {
    if (!subscription || !subscription.current_period_end) {
      return undefined;
    }

    const date = getDateFromStripeDate(subscription.current_period_end);

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }, [subscription]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
    >
      <Container
        sx={{
          py: { xs: 8, md: 14 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            borderRadius: 6,
            padding: 6,
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
                    padding: spacing(2, 4),
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
                          sx={{ color: ({ palette }) => palette.common.black }}
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
                  sx={({ palette }) => ({
                    backgroundColor: palette.purple[10],
                    padding: 4,
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
                    padding: spacing(2, 4),
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
                    sx={({ palette }) => ({ color: palette.purple[80] })}
                  >
                    <strong>Includes the following each month:</strong>
                  </Typography>
                  <Box component="ul" marginBottom={3}>
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
                    padding: spacing(2, 4),
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
                  <Typography gutterBottom component="p" variant="bpSmallCopy">
                    <strong>As well as:</strong>
                  </Typography>
                  <Box component="ul" marginBottom={4}>
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
                  alignItems: "center",
                }}
              >
                <Box>
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
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    marginBottom={2}
                  >
                    <Box>
                      <Typography variant="bpSmallCopy" component="p">
                        <strong>New monthly total</strong>
                      </Typography>
                      <Typography
                        variant="bpSmallCopy"
                        component="p"
                        sx={{ color: ({ palette }) => palette.gray["60"] }}
                      >
                        {isUpgradingExistingPaidSubscription ? (
                          <>Base price you’ll pay going forward</>
                        ) : (
                          <>
                            {upgradedSubscriptionTier
                              ? subscriptionTierToHumanReadable(
                                  upgradedSubscriptionTier,
                                )
                              : ""}{" "}
                            plan starting on {dateToHumanReadable(new Date())}
                          </>
                        )}
                      </Typography>
                    </Box>
                    {/* @todo: figure out how to determine this programmatically */}
                    <Typography gutterBottom>
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
                        : ""}{" "}
                      /month
                    </Typography>
                  </Box>
                  {isUpgradingExistingPaidSubscription ? (
                    <>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        marginBottom={2}
                      >
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
                                <Box
                                  component="span"
                                  sx={{ marginLeft: 1, cursor: "pointer" }}
                                >
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
                          {subscriptionTierPrices && upgradedSubscriptionTier
                            ? priceToHumanReadable({
                                amountInCents:
                                  subscriptionTierPrices[
                                    upgradedSubscriptionTier
                                  ].unit_amount! -
                                  subscriptionTierPrices[
                                    currentSubscriptionTier as "hobby"
                                  ].unit_amount!,
                                currency:
                                  subscriptionTierPrices[
                                    upgradedSubscriptionTier
                                  ].currency,
                              })
                            : ""}
                        </Typography>
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        marginBottom={4}
                      >
                        <Typography variant="bpSmallCopy" component="p">
                          <strong>Payment method</strong>
                        </Typography>
                        {/* @todo - display existing billing information */}
                      </Box>
                    </>
                  ) : null}

                  <Box marginBottom={4}>
                    {isUpgradingExistingPaidSubscription ? (
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
                          Upgrade my account to{" "}
                          {upgradedSubscriptionTier
                            ? subscriptionTierToHumanReadable(
                                upgradedSubscriptionTier,
                              )
                            : ""}
                        </Button>
                      ) : null
                    ) : stripeElementsOptions.clientSecret ? (
                      <Elements
                        stripe={stripePromise}
                        options={stripeElementsOptions}
                      >
                        <CreateSubscriptionCheckoutForm
                          onCompleted={handleUpgradedSubscription}
                          clientSecret={clientSecret}
                        />
                      </Elements>
                    ) : null}
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
                    our <Link href="/">Terms of Service</Link> and{" "}
                    <Link href="/">Privacy Statement</Link>.
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
                      <code>BLOCKPROTOL</code> or <code>BLOCKPROTOCOL.ORG</code>{" "}
                      depending on your payment provider.
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
      </Container>
    </Box>
  );
};

export default withAuthWall(UpgradePage);
