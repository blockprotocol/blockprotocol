import {
  faArrowRight,
  faCaretRight,
  faCheck,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { SubscriptionTierPrices } from "@local/internal-api-client";
import {
  Box,
  Collapse,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/legacy/image";
import { FunctionComponent, ReactNode, useState } from "react";

import proTierBackground from "../../../../public/assets/pricing/pro-tier-background.svg";
import { externalServiceFreeAllowance } from "../../../pages/settings/billing-settings-panel/external-service-free-allowance";
import { SubscriptionFeatureList } from "../../../pages/settings/billing-settings-panel/subscription-feature-list";
import { SubscriptionFeature } from "../../../pages/settings/billing-settings-panel/subscription-feature-list-item";
import {
  PaidSubscriptionTier,
  priceToHumanReadable,
} from "../../../pages/shared/subscription-utils";
import { ArrowLeftIcon, FontAwesomeIcon } from "../../icons";
import { AbstractAiIcon } from "../../icons/abstract-ai-icon";
import { MapboxIcon } from "../../icons/mapbox-icon";
import { MapboxLogoIcon } from "../../icons/mapbox-logo-icon";
import { OpenAiIcon } from "../../icons/open-ai-icon";
import { faBolt } from "../../icons/pro/fa-bolt";
import { faCheckDouble } from "../../icons/pro/fa-check-double";
import { faCoins } from "../../icons/pro/fa-coins";
import { faFlaskVial } from "../../icons/pro/fa-flask-vial";
import { faHand } from "../../icons/pro/fa-hand";
import { faImage } from "../../icons/pro/fa-image";
import { faJetFighterUp } from "../../icons/pro/fa-jet-fighter-up";
import { faLocationCrosshairs } from "../../icons/pro/fa-location";
import { faLocationArrow } from "../../icons/pro/fa-location-arrow";
import { faLocationDot } from "../../icons/pro/fa-location-dot";
import { faLock } from "../../icons/pro/fa-lock";
import { faMap } from "../../icons/pro/fa-map";
import { faMapLocationDot } from "../../icons/pro/fa-map-location-dot";
import { faMicrophone } from "../../icons/pro/fa-microphone";
import { faPeopleArrows } from "../../icons/pro/fa-people-arrows";
import { faRocketLaunch } from "../../icons/pro/fa-rocket-launch";
import { faTag } from "../../icons/pro/fa-tag";
import { faText } from "../../icons/pro/fa-text";
import { faTrophy } from "../../icons/pro/fa-trophy";
import { faTrophyStar } from "../../icons/pro/fa-trophy-star";
import { SparklesGradientIcon } from "../../icons/sparkles-gradient-icon";
import { CustomLinkButton } from "./custom-link-button";
import { GradientFontAwesomeIcon } from "./gradient-fontawesome-icon";

const getListIcon = (icon: IconDefinition) => (
  <GradientFontAwesomeIcon icon={icon} sx={{ width: 20, height: 15 }} light />
);

type PaidSubscription = {
  coreFeatures: SubscriptionFeature[];
  additionalFeatures: SubscriptionFeature[];
};

export const paidSubscriptionFeatures: Record<
  PaidSubscriptionTier,
  PaidSubscription
> = {
  hobby: {
    coreFeatures: [
      {
        icon: (
          <Box mr={1.75} mt={1} position="relative">
            <GradientFontAwesomeIcon
              icon={faImage}
              sx={{ height: 30, width: 30 }}
              light
            />
            <AbstractAiIcon
              background="rgb(99,23,193)"
              sx={{
                fontSize: 24,
                position: "absolute",
                top: -12,
                right: -12,
              }}
            />
          </Box>
        ),
        title: (
          <Box
            component="span"
            sx={{ color: ({ palette }) => palette.purple[30] }}
          >
            <strong>50</strong> OpenAI DALL-E images
            <br />
            <Typography
              component="span"
              variant="bpMicroCopy"
              sx={{
                color: "inherit",
                opacity: 0.6,
                fontWeight: 400,
              }}
            >
              Maximum quality (1024x1024 pixels)
            </Typography>
          </Box>
        ),
      },
      {
        icon: (
          <Box mr={1.75} mt={1} position="relative">
            <GradientFontAwesomeIcon
              icon={faText}
              sx={{ height: 29, width: 30 }}
              light
            />
            <AbstractAiIcon
              background="rgb(99,23,193)"
              sx={{
                fontSize: 24,
                position: "absolute",
                top: -12,
                right: -12,
              }}
            />
          </Box>
        ),
        title: (
          <Box
            component="span"
            sx={{ color: ({ palette }) => palette.purple[30] }}
          >
            <strong>200,000</strong> OpenAI GPT-3 tokens
            <br />
            <Typography
              component="span"
              variant="bpMicroCopy"
              sx={{
                color: "inherit",
                opacity: 0.6,
                fontWeight: 400,
              }}
            >
              Equating to ~150k words
            </Typography>
          </Box>
        ),
        description: (
          <Box mt={1.5}>
            <SubscriptionFeatureList
              features={[
                {
                  icon: <GradientFontAwesomeIcon icon={faArrowRight} light />,
                  title: (
                    <Box
                      component="span"
                      sx={{ color: ({ palette }) => palette.purple[30] }}
                    >
                      <strong>10k</strong> OpenAI Davinci tokens
                    </Box>
                  ),
                  iconCentered: true,
                },
                {
                  icon: <GradientFontAwesomeIcon icon={faArrowRight} light />,
                  title: (
                    <Box
                      component="span"
                      sx={{ color: ({ palette }) => palette.purple[30] }}
                    >
                      <strong>40k</strong> OpenAI Curie tokens
                    </Box>
                  ),
                  iconCentered: true,
                },
                {
                  icon: <GradientFontAwesomeIcon icon={faArrowRight} light />,
                  title: (
                    <Box
                      component="span"
                      sx={{ color: ({ palette }) => palette.purple[30] }}
                    >
                      <strong>50k</strong> OpenAI Babbage tokens
                    </Box>
                  ),
                  iconCentered: true,
                },
                {
                  icon: <GradientFontAwesomeIcon icon={faArrowRight} light />,
                  title: (
                    <Box
                      component="span"
                      sx={{ color: ({ palette }) => palette.purple[30] }}
                    >
                      <strong>100k</strong> OpenAI Ada tokens
                    </Box>
                  ),
                  iconCentered: true,
                },
              ]}
            />
          </Box>
        ),
      },
      {
        icon: (
          <Box mr={1.75} mt={1} position="relative">
            <GradientFontAwesomeIcon
              icon={faLocationDot}
              sx={{ height: 34, width: 30 }}
              light
            />
            <SparklesGradientIcon
              background="rgb(99,23,193)"
              sx={{
                fontSize: 21,
                position: "absolute",
                top: -6,
                right: -10,
              }}
            />
          </Box>
        ),
        title: (
          <Box
            component="span"
            sx={{ color: ({ palette }) => palette.purple[30] }}
          >
            <strong>
              {
                externalServiceFreeAllowance["Mapbox Address Autofill Session"]
                  .hobby
              }
            </strong>{" "}
            Mapbox Address Autofills
            <br />
            <Typography
              component="span"
              variant="bpMicroCopy"
              sx={{
                color: "inherit",
                opacity: 0.6,
                fontWeight: 400,
              }}
            >
              Provides full addresses as structured data
            </Typography>
          </Box>
        ),
      },
      {
        icon: (
          <Box mr={1.75} mt={1} position="relative">
            <GradientFontAwesomeIcon
              icon={faMap}
              sx={{ height: 27, width: 30 }}
              light
            />
            <SparklesGradientIcon
              background="rgb(99,23,193)"
              sx={{
                fontSize: 21,
                position: "absolute",
                top: -6,
                right: -10,
              }}
            />
          </Box>
        ),
        title: (
          <Box
            component="span"
            sx={{ color: ({ palette }) => palette.purple[30] }}
          >
            <strong>300</strong> Mapbox Static Images
            <br />
            <Typography
              component="span"
              variant="bpMicroCopy"
              sx={{
                color: "inherit",
                opacity: 0.6,
                fontWeight: 400,
              }}
            >
              Provides unique map tiles
            </Typography>
          </Box>
        ),
      },
    ],
    additionalFeatures: [
      {
        icon: getListIcon(faTrophy),
        title: (
          <>
            Unique <strong>“Early Supporter”</strong> profile badge
          </>
        ),
      },
      {
        icon: getListIcon(faPeopleArrows),
        title: (
          <>
            Access to <strong>3rd party APIs</strong>
          </>
        ),
        planned: true,
      },
      {
        icon: getListIcon(faCoins),
        title: (
          <>
            <strong>Usage-based billing</strong> for additional credits/tokens
          </>
        ),
      },
      {
        icon: getListIcon(faHand),
        title: (
          <>
            Ability to <strong>prevent or cap</strong> overage charges{" "}
            <Box
              component="span"
              sx={{ color: ({ palette }) => palette.purple[50] }}
            >
              (optional)
            </Box>
          </>
        ),
      },
    ],
  },
  pro: {
    coreFeatures: [
      {
        icon: getListIcon(faCheckDouble),
        title: (
          <Box
            component="span"
            sx={{ color: ({ palette }) => palette.purple[30] }}
          >
            <strong>Double</strong> the usage allowance of all hobby limits
            <br />
            <Typography
              component="span"
              variant="bpMicroCopy"
              sx={{
                color: ({ palette }) => palette.purple[60],
              }}
            >
              e.g. 300k+ words, 100 images, and{" "}
              {
                externalServiceFreeAllowance["Mapbox Address Autofill Session"]
                  .pro
              }{" "}
              address autofills
            </Typography>
          </Box>
        ),
      },
      {
        icon: getListIcon(faLocationCrosshairs),
        title: (
          <Box
            component="span"
            sx={{ color: ({ palette }) => palette.purple[30] }}
          >
            <strong>500</strong> Mapbox Isochrone API calls
          </Box>
        ),
      },
      {
        icon: getListIcon(faLocationArrow),
        title: (
          <Box
            component="span"
            sx={{ color: ({ palette }) => palette.purple[30] }}
          >
            <strong>500</strong> Mapbox Directions API calls
          </Box>
        ),
      },
      {
        icon: getListIcon(faMapLocationDot),
        title: (
          <Box
            component="span"
            sx={{ color: ({ palette }) => palette.purple[30] }}
          >
            <strong>500</strong> Mapbox Temporary Geocoding API calls
          </Box>
        ),
      },
      {
        icon: getListIcon(faMicrophone),
        title: (
          <Box
            component="span"
            sx={{ color: ({ palette }) => palette.purple[30] }}
          >
            <strong>60 mins</strong> OpenAI Whisper audio transcription
          </Box>
        ),
        planned: true,
        plannedSx: {
          background:
            "linear-gradient(0deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), linear-gradient(96.93deg, #6834FB 18.76%, #FF45EC 49.79%)",
          backgroundClip: "text",
        },
      },
      {
        icon: getListIcon(faFlaskVial),
        title: (
          <Box
            component="span"
            sx={{ color: ({ palette }) => palette.purple[30] }}
          >
            <strong>Early-access</strong> to new APIs
          </Box>
        ),
      },
    ],
    additionalFeatures: [
      {
        icon: getListIcon(faTrophyStar),
        title: (
          <>
            Additional unique <strong>“Founder Member”</strong> profile badge
          </>
        ),
      },
      {
        icon: getListIcon(faTag),
        title: (
          <>
            <strong>Discounted access</strong> to additional API calls
          </>
        ),
      },
      {
        icon: getListIcon(faLock),
        title: (
          <>
            <strong>Private</strong> blocks and types
          </>
        ),
        planned: true,
      },
      {
        icon: getListIcon(faJetFighterUp),
        title: (
          <>
            <strong>Bonus</strong> features, updates and special event invites
          </>
        ),
        planned: true,
      },
    ],
  },
};

interface HobbyTierPerkProps {
  headerIcon: IconDefinition;
  title: string;
  description: string;
  poweredByIcon: ReactNode;
  poweredBy: string;
}

const HobbyTierPerk = ({
  headerIcon,
  title,
  description,
  poweredByIcon,
  poweredBy,
}: HobbyTierPerkProps) => {
  return (
    <Stack sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          paddingY: 1.5,
          paddingX: 2.25,
          background: "rgba(79, 34, 133, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "inset 0px 2px 8px rgba(0, 0, 0, 0.11)",
          borderTopRightRadius: 12,
          borderTopLeftRadius: 12,
        }}
      >
        <Stack flexDirection="row" gap={1} alignItems="center" mb={0.25}>
          <GradientFontAwesomeIcon
            icon={headerIcon}
            sx={{ height: 17, width: 20 }}
            light
          />
          <Typography
            variant="bpLargeText"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              color: ({ palette }) => palette.purple[30],
            }}
          >
            {title}
          </Typography>
        </Stack>
        <Typography
          variant="bpBodyCopy"
          sx={{
            lineHeight: 1.2,
            color: ({ palette }) => palette.purple[30],
          }}
        >
          {description}
        </Typography>
      </Box>

      <Box
        sx={{
          paddingY: 1.5,
          paddingX: 2.25,
          background: "rgba(71, 0, 167, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderTopWidth: 0,
          boxShadow: "inset 0px 2px 8px rgba(0, 0, 0, 0.11)",
          borderBottomRightRadius: 12,
          borderBottomLeftRadius: 12,
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {poweredByIcon}
        <Typography
          variant="bpHeading5"
          sx={{
            fontSize: "0.75rem",
            lineHeight: 1.2,
            color: ({ palette }) => palette.purple[30],
            textTransform: "uppercase",
          }}
        >
          Powered by{" "}
          <Box component="span" sx={{ fontWeight: 500, fontSize: "0.8125rem" }}>
            {poweredBy}
          </Box>
        </Typography>
      </Box>
    </Stack>
  );
};

export const PaidTiersSection: FunctionComponent<{
  signedIn: boolean;
  currentSubscriptionTier: "free" | "hobby" | "pro" | undefined;
  subscriptionTierPrices: SubscriptionTierPrices | undefined;
}> = ({ signedIn, currentSubscriptionTier, subscriptionTierPrices }) => {
  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.up("lg"));

  const [fullPlanDetailsOpen, setFullPlanDetailsOpen] = useState(false);

  return (
    <Container
      sx={{
        position: "relative",
        mb: { xs: 8, md: 12.5 },
        maxWidth: { md: 800, lg: 1200 },
        px: "6.5%",
      }}
    >
      <Typography
        variant="bpHeading4"
        sx={{ textTransform: "uppercase", mb: 2, lineHeight: 1.4 }}
      >
        <strong>Paid</strong>{" "}
        <Box component="span" sx={{ color: ({ palette }) => palette.gray[60] }}>
          accounts
        </Box>
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          mb: 2.5,
          rowGap: 1,
        }}
      >
        <Typography
          variant="bpSmallCopy"
          sx={{
            lineHeight: 1.4,
            fontSize: "0.875rem",
            textTransform: "uppercase",
            color: ({ palette }) => palette.gray[70],
          }}
        >
          <Box component="span" sx={{ mr: 1.75 }}>
            Includes access to
          </Box>
          <Box component="span" sx={{ whiteSpace: "nowrap" }}>
            <OpenAiIcon
              sx={{
                mr: 1.75,
                height: 24,
                width: "auto",
                position: "relative",
                top: -1,
              }}
            />
            <MapboxIcon
              sx={{
                height: 24,
                width: "auto",
                position: "relative",
                top: -1,
              }}
            />
          </Box>
        </Typography>

        <Typography
          variant="bpSmallCopy"
          sx={{
            fontWeight: 400,
            fontSize: "1.125rem",
            lineHeight: 1.6,
            color: ({ palette }) => palette.gray[70],
          }}
        >
          Paid plans enable access to advanced third-party APIs within blocks
        </Typography>
      </Box>

      <Grid
        container
        sx={{
          ...(lg
            ? {
                boxShadow: "0px 4.23704px 8.1px rgb(61 78 133 / 6%)",
                overflow: "hidden",
                borderRadius: 4,
              }
            : { gridGap: 32 }),
        }}
      >
        <Grid
          item
          lg={6}
          md={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: 1,
            ...(!lg
              ? {
                  boxShadow: "0px 4.23704px 8.1px rgb(61 78 133 / 6%)",
                  overflow: "hidden",
                  borderRadius: 4,
                }
              : {}),
          }}
        >
          <Box
            sx={{
              flex: 1,
              background:
                "url(/assets/pricing/grain.png), linear-gradient(0deg, rgba(48, 0, 149, 0.39), rgba(48, 0, 149, 0.39)), radial-gradient(128.95% 319.39% at 95.1% 4.09%, #DC569E 0%, #9956DC 35.71%, #8000FF 100%)",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                rowGap: 1,
                width: 1,
                padding: 4,
                borderBottomStyle: "solid",
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <Stack flexDirection="column">
                <Box display="flex" alignItems="center">
                  <Typography
                    sx={{
                      fontSize: 28,
                      color: ({ palette }) => palette.common.white,
                    }}
                  >
                    <strong>
                      {subscriptionTierPrices
                        ? priceToHumanReadable({
                            amountInCents:
                              subscriptionTierPrices?.hobby.unit_amount!,
                            currency: subscriptionTierPrices?.hobby.currency!,
                            decimalPlaces: 0,
                          })
                        : null}
                    </strong>
                    /month
                  </Typography>
                  <Typography
                    sx={{
                      marginLeft: 3,
                      fontSize: 14,
                      fontWeight: 600,
                      color: ({ palette }) => palette.common.white,
                    }}
                  >
                    HOBBY
                  </Typography>
                </Box>
                <Typography
                  variant="bpBodyCopy"
                  gutterBottom
                  sx={{
                    display: "inline-flex",
                    color: ({ palette }) => palette.purple[300],
                    fontWeight: 400,
                  }}
                >
                  Best for casual users of blocks
                </Typography>
              </Stack>

              <Box>
                <CustomLinkButton
                  href={{
                    pathname: "/settings/billing/upgrade",
                    query: { tier: "hobby" },
                  }}
                  endIcon={
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      sx={{
                        color: theme.palette.common.white,
                      }}
                    />
                  }
                >
                  {signedIn ? "Continue" : "Sign up"}
                </CustomLinkButton>
              </Box>
            </Box>
            <Box
              sx={({ spacing }) => ({
                padding: spacing(4),
                flexGrow: 1,
              })}
            >
              <Typography
                variant="bpSmallCaps"
                sx={{
                  color: ({ palette }) => palette.common.white,
                  textTransform: "none",
                  letterSpacing: "unset",
                  fontWeight: 500,
                }}
              >
                Includes the following every month...
              </Typography>

              <Stack flexDirection="row" flexWrap="wrap" gap={1} mt={2.25}>
                <HobbyTierPerk
                  headerIcon={faText}
                  title="150k"
                  description="AI-generated words"
                  poweredByIcon={<AbstractAiIcon sx={{ fontSize: 20 }} />}
                  poweredBy="GPT-3"
                />
                <HobbyTierPerk
                  headerIcon={faImage}
                  title="50"
                  description="AI-generated images"
                  poweredByIcon={<AbstractAiIcon sx={{ fontSize: 20 }} />}
                  poweredBy="DALL-E"
                />
                <HobbyTierPerk
                  headerIcon={faLocationDot}
                  title={externalServiceFreeAllowance[
                    "Mapbox Address Autofill Session"
                  ].hobby.toString()}
                  description="Address autofills"
                  poweredByIcon={<MapboxLogoIcon sx={{ fontSize: 20 }} />}
                  poweredBy="MAPBOX"
                />
                <HobbyTierPerk
                  headerIcon={faMapLocationDot}
                  title="300"
                  description="Unique maps created"
                  poweredByIcon={<MapboxLogoIcon sx={{ fontSize: 20 }} />}
                  poweredBy="MAPBOX"
                />
              </Stack>

              <Typography
                onClick={() => setFullPlanDetailsOpen(!fullPlanDetailsOpen)}
                variant="bpSmallCaps"
                sx={({ palette, transitions }) => ({
                  display: "flex",
                  cursor: "pointer",
                  fontWeight: 500,
                  lineHeight: 1.2,
                  fontSize: "0.8125rem",
                  color: palette.purple[40],
                  transition: transitions.create("opacity"),
                  "&:hover": {
                    opacity: 0.8,
                    "& svg": {
                      marginLeft: 1,
                    },
                  },
                  marginTop: 3,
                })}
              >
                View full plan details
                <FontAwesomeIcon
                  icon={faCaretRight}
                  sx={{
                    position: "relative",
                    top: -1,
                    marginLeft: 0.5,
                    transition: ({ transitions }) =>
                      transitions.create(["margin-left", "transform"]),
                    transform: `rotate(${fullPlanDetailsOpen ? 90 : 0}deg)`,
                  }}
                />
              </Typography>

              <Collapse in={fullPlanDetailsOpen}>
                <Box mt={3} mb={2}>
                  <SubscriptionFeatureList
                    features={paidSubscriptionFeatures.hobby.coreFeatures}
                  />
                </Box>
              </Collapse>
            </Box>
          </Box>

          <Box
            sx={({ palette }) => ({
              padding: 4,
              borderStyle: "solid",
              borderWidth: 1,
              borderTopWidth: 0,
              borderColor: palette.gray[20],
              background: palette.white,
            })}
          >
            <SubscriptionFeatureList
              heading={<Box mb={1.5}>As well as:</Box>}
              features={paidSubscriptionFeatures.hobby.additionalFeatures}
            />
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              marginTop={4}
              mb={1.5}
            >
              <CustomLinkButton
                href={{
                  pathname: "/settings/billing/upgrade",
                  query: { tier: "hobby" },
                }}
                endIcon={
                  <FontAwesomeIcon
                    icon={
                      currentSubscriptionTier === "hobby" ||
                      currentSubscriptionTier === "pro"
                        ? faCheck
                        : faRocketLaunch
                    }
                  />
                }
                disabled={
                  currentSubscriptionTier === "hobby" ||
                  currentSubscriptionTier === "pro"
                }
                sx={{ width: "calc(100% - 64px)" }}
              >
                {signedIn ? (
                  <Box component="span">
                    {currentSubscriptionTier === "hobby"
                      ? "Your current tier"
                      : null}
                    {currentSubscriptionTier === "pro" ? (
                      <>
                        You already have <strong>PRO</strong>
                      </>
                    ) : null}
                    {currentSubscriptionTier !== "hobby" &&
                    currentSubscriptionTier !== "pro" ? (
                      <>
                        Upgrade to unlock <strong>HOBBY</strong>
                      </>
                    ) : null}
                  </Box>
                ) : (
                  "Get started"
                )}
              </CustomLinkButton>
            </Box>
          </Box>
        </Grid>

        <Grid
          item
          lg={6}
          md={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: 1,
            ...(!lg
              ? {
                  boxShadow: "0px 4.23704px 8.1px rgb(61 78 133 / 6%)",
                  overflow: "hidden",
                  borderRadius: 4,
                }
              : {}),
          }}
        >
          <Box
            sx={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              background:
                "url(/assets/pricing/grain.png), linear-gradient(180deg, rgba(0, 0, 0, 0.62) 0%, rgba(0, 0, 0, 0.434) 100%), linear-gradient(87.84deg, #3300FF 14.51%, #A54BFF 100.25%)",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                rowGap: 1,
                width: 1,
                padding: 4,
                borderBottomStyle: "solid",
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <Stack flexDirection="column">
                <Box display="flex" alignItems="center">
                  <Typography
                    sx={{
                      fontSize: 28,
                      color: ({ palette }) => palette.common.white,
                    }}
                  >
                    <strong>
                      {subscriptionTierPrices
                        ? priceToHumanReadable({
                            amountInCents:
                              subscriptionTierPrices?.pro.unit_amount!,
                            currency: subscriptionTierPrices?.pro.currency!,
                            decimalPlaces: 0,
                          })
                        : null}
                    </strong>
                    /month
                  </Typography>
                  <Typography
                    sx={{
                      marginLeft: 3,
                      fontSize: 14,
                      fontWeight: 600,
                      color: ({ palette }) => palette.common.white,
                    }}
                  >
                    PRO
                  </Typography>
                </Box>
                <Typography
                  variant="bpBodyCopy"
                  gutterBottom
                  sx={{
                    display: "inline-flex",
                    color: ({ palette }) => palette.purple[500],
                    fontWeight: 400,
                  }}
                >
                  For embedders, devs and power-users
                </Typography>
              </Stack>

              {currentSubscriptionTier !== "pro" ? (
                <Box>
                  <CustomLinkButton
                    pink
                    href={{
                      pathname: "/settings/billing/upgrade",
                      query: { tier: "pro" },
                    }}
                    endIcon={
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        sx={{
                          color: theme.palette.common.white,
                        }}
                      />
                    }
                  >
                    {signedIn ? "Continue" : "Sign up"}
                  </CustomLinkButton>
                </Box>
              ) : null}
            </Box>

            <Box
              sx={({ spacing }) => ({
                padding: spacing(4),
              })}
            >
              <SubscriptionFeatureList
                heading={
                  <Box mb={3}>
                    <ArrowLeftIcon sx={{ fontSize: 18, marginRight: 2 }} />
                    Includes everything in{" "}
                    <Box
                      component="span"
                      sx={{ color: ({ palette }) => palette.pink[50] }}
                    >
                      the hobby plan
                    </Box>
                    , as well as...
                  </Box>
                }
                headingSx={{
                  color: ({ palette }) => palette.common.white,
                }}
                features={paidSubscriptionFeatures.pro.coreFeatures}
                gap={2.25}
              />
            </Box>
            {lg ? (
              <Collapse in={fullPlanDetailsOpen}>
                <Box sx={{ mt: 6.25 }}>
                  <Image
                    layout="responsive"
                    src={proTierBackground}
                    style={{ zIndex: 999 }}
                  />
                </Box>
              </Collapse>
            ) : null}
          </Box>

          <Box
            sx={({ palette }) => ({
              padding: 4,
              backgroundColor: "#FBF7FF",
              borderStyle: "solid",
              borderWidth: 1,
              borderTopWidth: 0,
              borderColor: palette.gray[20],
            })}
          >
            <SubscriptionFeatureList
              heading={<Box mb={1.5}>Plus you receive:</Box>}
              features={paidSubscriptionFeatures.pro.additionalFeatures}
            />
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              marginTop={4}
              mb={1.5}
            >
              <CustomLinkButton
                pink
                href={{
                  pathname: "/settings/billing/upgrade",
                  query: { tier: "pro" },
                }}
                endIcon={
                  <FontAwesomeIcon
                    icon={currentSubscriptionTier === "pro" ? faCheck : faBolt}
                  />
                }
                disabled={currentSubscriptionTier === "pro"}
                sx={{ width: "calc(100% - 64px)" }}
              >
                {signedIn ? (
                  <Box component="span">
                    {currentSubscriptionTier === "pro"
                      ? "Your current tier"
                      : null}
                    {currentSubscriptionTier !== "pro" ? (
                      <>
                        Upgrade to unlock <strong>PRO</strong>
                      </>
                    ) : null}
                  </Box>
                ) : (
                  "Get started"
                )}
              </CustomLinkButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
