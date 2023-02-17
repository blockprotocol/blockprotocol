import { SubscriptionTierPrices } from "@local/internal-api-client";
import { Box, Typography } from "@mui/material";
import { FunctionComponent } from "react";

import { AbstractAiIcon } from "../../../components/icons/abstract-ai-icon";
import { FlaskVialIcon } from "../../../components/icons/flask-vial-icon";
import { HandIcon } from "../../../components/icons/hand-icon";
import { JetFighterUpIcon } from "../../../components/icons/jet-fighter-up-icon";
import { LocationArrowIcon } from "../../../components/icons/location-arrow-icon";
import { LocationIcon } from "../../../components/icons/location-icon";
import { LockIcon } from "../../../components/icons/lock-icon";
import { MapLocationDotIcon } from "../../../components/icons/map-location-dot-icon";
import { MapboxLogoIcon } from "../../../components/icons/mapbox-logo-icon";
import { MicrophoneLogoIcon } from "../../../components/icons/microphone-icon";
import { TagIcon } from "../../../components/icons/tag-icon";
import { TrophyStarIcon } from "../../../components/icons/trophy-star-icon";
import { priceToHumanReadable } from "../../shared/subscription-utils";
import {
  SubscriptionFeature,
  SubscriptionFeatureListItem,
} from "./subscription-feature-list-item";

type FeatureKind =
  | "api-access"
  | "api-access-related"
  | "flair"
  | "advanced-controls";

export const proSubscriptionFeatures: Record<
  FeatureKind,
  SubscriptionFeature[]
> = {
  "api-access": [
    {
      icon: <AbstractAiIcon sx={{ fontSize: 18 }} />,
      title: (
        <>
          <strong>300k</strong> AI-generated words (powered by GPT-3)
        </>
      ),
    },
    {
      icon: <AbstractAiIcon sx={{ fontSize: 18 }} />,
      title: (
        <>
          <strong>100</strong> AI-generated images (powered by DALL-E)
        </>
      ),
    },
    {
      icon: <MapboxLogoIcon sx={{ fontSize: 18 }} />,
      title: (
        <>
          <strong>40</strong> Mapbox Address Autofills
        </>
      ),
    },
    {
      icon: <LocationIcon sx={{ fontSize: 18 }} />,
      title: (
        <>
          <strong>500</strong> Mapbox Isochrone API calls
        </>
      ),
    },
    {
      icon: <LocationArrowIcon sx={{ fontSize: 18 }} />,
      title: (
        <>
          <strong>500</strong> Mapbox Directions API calls
        </>
      ),
    },
    {
      icon: <MapLocationDotIcon sx={{ fontSize: 18 }} />,
      title: (
        <>
          <strong>500</strong> Mapbox Temporary Geocoding API calls
        </>
      ),
    },
    {
      icon: <MicrophoneLogoIcon sx={{ fontSize: 18 }} />,
      title: (
        <>
          <strong>60</strong> mins OpenAI Whisper audio transcription
        </>
      ),
      planned: true,
    },
  ],
  "api-access-related": [
    {
      icon: <FlaskVialIcon sx={{ fontSize: 18 }} />,
      title: (
        <>
          <strong>Early-access</strong> to new APIs
        </>
      ),
    },
    {
      icon: <TagIcon sx={{ fontSize: 18 }} />,
      title: (
        <>
          <strong>Discounted access</strong> to additional API calls beyond
          those already included
        </>
      ),
    },
  ],
  flair: [
    {
      icon: <TrophyStarIcon sx={{ fontSize: 18 }} />,
      title: (
        <>
          Exclusive <strong>“Early Supporter”</strong> and{" "}
          <strong>“Founder Member”</strong> profile badges on the Þ Hub
        </>
      ),
    },
  ],
  "advanced-controls": [
    {
      icon: <HandIcon sx={{ fontSize: 18 }} />,
      title: (
        <>
          <strong>Spend controls</strong> to prevent or limit usage-based
          overage charges
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
};

export const ProSubscriptionTierOverview: FunctionComponent<{
  subscriptionTierPrices: SubscriptionTierPrices;
}> = ({ subscriptionTierPrices }) => {
  return (
    <>
      <Box
        sx={{
          padding: 4,
          borderColor: ({ palette }) => palette.gray[20],
          borderStyle: "solid",
          borderWidth: 1,
          borderRadius: 4,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <Box display="flex" alignItems="center">
          <Typography sx={{ fontSize: 28 }}>
            <strong>
              {priceToHumanReadable({
                amountInCents: subscriptionTierPrices.pro.unit_amount!,
                currency: subscriptionTierPrices.pro.currency,
                decimalPlaces: 0,
              })}
            </strong>
            /month
          </Typography>
          <Typography sx={{ marginLeft: 3, fontSize: 14, fontWeight: 600 }}>
            PRO
          </Typography>
        </Box>
        <Typography
          component="p"
          variant="bpSmallCopy"
          gutterBottom
          sx={{
            color: ({ palette }) => palette.purple[60],
            fontWeight: 400,
          }}
        >
          Best for embedders, devs and power-users
        </Typography>
      </Box>
      <Box
        sx={{
          padding: 4,
          borderColor: ({ palette }) => palette.gray[20],
          borderStyle: "solid",
          borderWidth: 1,
          borderTopWidth: 0,
          borderRadius: 4,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <Typography
          component="p"
          variant="bpMicroCopy"
          gutterBottom
          sx={{ textTransform: "uppercase" }}
        >
          <strong>Api Access</strong>
        </Typography>
        <Box marginBottom={3}>
          {[
            ...proSubscriptionFeatures["api-access"],
            ...proSubscriptionFeatures["api-access-related"],
          ].map((feature, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <SubscriptionFeatureListItem key={index} feature={feature} />
          ))}
        </Box>
        <Typography
          component="p"
          variant="bpMicroCopy"
          gutterBottom
          sx={{ textTransform: "uppercase" }}
        >
          <strong>Flair</strong>
        </Typography>
        <Box marginBottom={3}>
          {proSubscriptionFeatures.flair.map((feature, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <SubscriptionFeatureListItem key={index} feature={feature} />
          ))}
        </Box>
        <Typography
          component="p"
          variant="bpMicroCopy"
          gutterBottom
          sx={{ textTransform: "uppercase" }}
        >
          <strong>Advanced Controls</strong>
        </Typography>
        {proSubscriptionFeatures["advanced-controls"].map((feature, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <SubscriptionFeatureListItem key={index} feature={feature} />
        ))}
      </Box>
    </>
  );
};
