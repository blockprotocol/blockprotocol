import {
  faCaretRight,
  faCheck,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Container,
  Grid,
  Link,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

import { useUser } from "../../../context/user-context";
import { SubscriptionFeatureList } from "../../../pages/settings/billing-settings-panel/subscription-feature-list";
import { SubscriptionFeature } from "../../../pages/settings/billing-settings-panel/subscription-feature-list-item";
import { PaidSubscriptionTier } from "../../../pages/shared/subscription-utils";
import { ArrowLeftIcon, ArrowRightIcon, FontAwesomeIcon } from "../../icons";
import { AbstractAiIcon } from "../../icons/abstract-ai-icon";
import { BoltRegularIcon } from "../../icons/bolt-regular-icon";
import { CheckDoubleIcon } from "../../icons/check-double-icon";
import { CoinsIcon } from "../../icons/coins-icon";
import { FlaskVialIcon } from "../../icons/flask-vial-icon";
import { HandIcon } from "../../icons/hand-icon";
import { JetFighterUpIcon } from "../../icons/jet-fighter-up-icon";
import { LocationArrowIcon } from "../../icons/location-arrow-icon";
import { LocationIcon } from "../../icons/location-icon";
import { LockIcon } from "../../icons/lock-icon";
import { MapLocationDotIcon } from "../../icons/map-location-dot-icon";
import { MapboxIcon } from "../../icons/mapbox-icon";
import { MapboxLogoIcon } from "../../icons/mapbox-logo-icon";
import { MicrophoneLogoIcon } from "../../icons/microphone-icon";
import { OpenAiIcon } from "../../icons/open-ai-icon";
import { PeopleArrowsIcon } from "../../icons/people-arrows-icon";
import { faImage } from "../../icons/pro/fa-image";
import { faLocationDot } from "../../icons/pro/fa-location-dot";
import { faMapLocationDot } from "../../icons/pro/fa-map-location-dot";
import { faText } from "../../icons/pro/fa-text";
import { RocketRegularIcon } from "../../icons/rocket-regular-icon";
import { TagIcon } from "../../icons/tag-icon";
import { TrophyIcon } from "../../icons/trophy-icon";
import { TrophyStarIcon } from "../../icons/trophy-star-icon";
import { LinkButton } from "../../link-button";
import { GradientFontAwesomeIcon } from "./gradient-fontawesome-icon";

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
        icon: <AbstractAiIcon sx={{ fontSize: 18 }} />,
        title: (
          <>
            <strong>150k</strong> AI-generated words (powered by GPT-3)
          </>
        ),
      },
      {
        icon: <AbstractAiIcon sx={{ fontSize: 18 }} />,
        title: (
          <>
            <strong>50</strong> AI-generated images (powered by DALL-E)
          </>
        ),
      },
      {
        icon: <MapboxLogoIcon sx={{ fontSize: 18 }} />,
        title: (
          <>
            <strong>20</strong> Mapbox Address Autofills
          </>
        ),
      },
    ],
    additionalFeatures: [
      {
        icon: <TrophyIcon sx={{ fontSize: 18 }} />,
        title: (
          <>
            Unique <strong>“Early Supporter”</strong> profile badge
          </>
        ),
      },
      {
        icon: <PeopleArrowsIcon sx={{ fontSize: 18 }} />,
        title: (
          <>
            Access to <strong>3rd party APIs</strong>
          </>
        ),
        planned: true,
      },
      {
        icon: <CoinsIcon sx={{ fontSize: 18 }} />,
        title: (
          <>
            <strong>Usage-based billing</strong> for additional credits/tokens
          </>
        ),
      },
      {
        icon: <HandIcon sx={{ fontSize: 18 }} />,
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
        icon: <CheckDoubleIcon sx={{ fontSize: 18 }} />,
        title: (
          <Box
            component="span"
            sx={{ color: ({ palette }) => palette.purple[30] }}
          >
            <strong>Double</strong> the usage allowance of all hobby limits
            <br />
            <Box
              component="span"
              sx={{
                color: ({ palette }) => palette.common.white,
                opacity: 0.6,
              }}
            >
              e.g. 300k+ words, 100 images, and 40 address autofills
            </Box>
          </Box>
        ),
      },
      {
        icon: <LocationIcon sx={{ fontSize: 18 }} />,
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
        icon: <LocationArrowIcon sx={{ fontSize: 18 }} />,
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
        icon: <MapLocationDotIcon sx={{ fontSize: 18 }} />,
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
        icon: <MicrophoneLogoIcon sx={{ fontSize: 18 }} />,
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
        icon: <FlaskVialIcon sx={{ fontSize: 18 }} />,
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
        icon: <TrophyStarIcon sx={{ fontSize: 18 }} />,
        title: (
          <>
            Additional unique <strong>“Founder Member”</strong> profile badge
          </>
        ),
      },
      {
        icon: <TagIcon sx={{ fontSize: 18 }} />,
        title: (
          <>
            <strong>Discounted access</strong> to additional API calls
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
            sx={{ fontSize: 17 }}
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

const CustomLinkButton = styled(LinkButton)(({ theme }) => ({
  "& .MuiTypography-root": {
    color: theme.palette.common.white,
  },
  "&.Mui-disabled": {
    backgroundColor: theme.palette.gray[10],
    color: theme.palette.gray[50],
    borderColor: theme.palette.gray[30],
    borderStyle: "solid",
    borderWidth: 1,
    "& .MuiTypography-root": {
      color: theme.palette.gray[50],
    },
  },
}));

export const PaidTiersSection: FunctionComponent = () => {
  const isCurrentSubscriptionTierHobby = true;
  return (
    <Container
      sx={{
        position: "relative",
        mb: { xs: 6, md: 10 },
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
          mb: 3,
        }}
      >
        <Typography
          component="p"
          variant="bpSmallCopy"
          sx={{
            lineHeight: 1.4,
            fontSize: "0.875rem",
            textTransform: "uppercase",
            color: ({ palette }) => palette.gray[70],
          }}
        >
          Includes access to
          <OpenAiIcon
            sx={{
              ml: 1.75,
              height: 24,
              width: "auto",
              position: "relative",
              top: -1,
            }}
          />
          <MapboxIcon
            sx={{
              ml: 1.75,
              height: 24,
              width: "auto",
              position: "relative",
              top: -1,
            }}
          />
        </Typography>

        <Typography
          component="p"
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

      <Grid container>
        <Grid
          item
          md={6}
          sm={12}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Box
            sx={{
              flex: 1,
              borderTopLeftRadius: 14,
              borderTopRightRadius: {
                xs: 14,
                md: 0,
              },
              background:
                "url(/assets/pricing/grain.png), linear-gradient(0deg, rgba(48, 0, 149, 0.39), rgba(48, 0, 149, 0.39)), radial-gradient(128.95% 319.39% at 95.1% 4.09%, #DC569E 0%, #9956DC 35.71%, #8000FF 100%)",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                justifyContent: "space-between",
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
                      {/* {priceToHumanReadable({
                    amountInCents: subscriptionTierPrices.hobby.unit_amount!,
                    currency: subscriptionTierPrices.hobby.currency,
                    decimalPlaces: 0,
                  })} */}
                      2
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

              <CustomLinkButton
                href={{
                  pathname: "/settings/billing/upgrade",
                  query: { tier: "hobby" },
                }}
                variant="primary"
                endIcon={
                  isCurrentSubscriptionTierHobby ? undefined : (
                    <ArrowRightIcon />
                  )
                }
                disabled={isCurrentSubscriptionTierHobby}
                size="small"
                sx={{ height: 40 }}
              >
                {isCurrentSubscriptionTierHobby
                  ? "Your current plan"
                  : "Continue"}
              </CustomLinkButton>
            </Box>
            <Box
              sx={({ spacing }) => ({
                padding: spacing(2, 4),
                flexGrow: 1,
              })}
            >
              <Typography
                variant="bpSmallCopy"
                sx={{
                  fontFamily: "colfax-web",
                  color: ({ palette }) => palette.common.white,
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
                  title="20"
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
              {/* <SubscriptionFeatureList
                heading={
                  <Box mb={3}>Includes the following every month...</Box>
                }
                headingSx={({ palette }) => ({ color: palette.common.white })}
                features={paidSubscriptionFeatures.hobby.coreFeatures}
              /> */}
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
                    marginTop: 2,
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
            </Box>
          </Box>

          <Box
            sx={{
              padding: 4,
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: ({ palette }) => palette.gray[20],
              borderRightWidth: {
                xs: 1,
                md: 0,
              },
              borderBottomLeftRadius: {
                xs: 0,
                md: 14,
              },
            }}
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
                size="small"
                endIcon={
                  isCurrentSubscriptionTierHobby ? (
                    <FontAwesomeIcon icon={faCheck} />
                  ) : (
                    <RocketRegularIcon />
                  )
                }
                disabled={isCurrentSubscriptionTierHobby}
                sx={{ height: 40 }}
              >
                <Typography variant="bpSmallCopy">
                  {isCurrentSubscriptionTierHobby ? (
                    <>Your current level of access</>
                  ) : (
                    <>
                      Get started with <strong>HOBBY</strong>
                    </>
                  )}
                </Typography>
              </CustomLinkButton>
            </Box>
          </Box>
        </Grid>

        <Grid
          item
          md={6}
          sm={12}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Box
            sx={{
              flex: 1,
              borderTopRightRadius: {
                xs: 0,
                md: 14,
              },
              background:
                "url(/assets/pricing/grain.png), linear-gradient(180deg, rgba(0, 0, 0, 0.62) 0%, rgba(0, 0, 0, 0.434) 100%), linear-gradient(87.84deg, #3300FF 14.51%, #A54BFF 100.25%)",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                justifyContent: "space-between",
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
                      {/* {priceToHumanReadable({
                    amountInCents: subscriptionTierPrices.hobby.unit_amount!,
                    currency: subscriptionTierPrices.hobby.currency,
                    decimalPlaces: 0,
                  })} */}
                      2
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

              <CustomLinkButton
                href={{
                  pathname: "/settings/billing/upgrade",
                  query: { tier: "hobby" },
                }}
                variant="primary"
                endIcon={
                  isCurrentSubscriptionTierHobby ? undefined : (
                    <ArrowRightIcon />
                  )
                }
                disabled={isCurrentSubscriptionTierHobby}
                size="small"
              >
                {isCurrentSubscriptionTierHobby
                  ? "Your current plan"
                  : "Continue"}
              </CustomLinkButton>
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
              />
            </Box>
          </Box>

          <Box
            sx={({ palette }) => ({
              padding: 4,
              backgroundColor: "#FBF7FF",
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: palette.gray[20],
              borderBottomRightRadius: 14,
              borderBottomLeftRadius: {
                xs: 14,
                md: 0,
              },
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
              <LinkButton
                href={{
                  pathname: "/settings/billing/upgrade",
                  query: { tier: "pro" },
                }}
                size="small"
                sx={{ height: 40 }}
                endIcon={<BoltRegularIcon />}
              >
                <Typography
                  variant="bpSmallCopy"
                  sx={{ color: ({ palette }) => palette.common.white }}
                >
                  {isCurrentSubscriptionTierHobby ? (
                    <>
                      Upgrade to unlock <strong>PRO</strong>
                    </>
                  ) : (
                    <>
                      Get started with <strong>PRO</strong>
                    </>
                  )}
                </Typography>
              </LinkButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
