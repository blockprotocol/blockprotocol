import { Box, Typography, TypographyProps } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

import {
  SubscriptionFeature,
  SubscriptionFeatureListItem,
} from "./subscription-feature-list-item";

export const SubscriptionFeatureList: FunctionComponent<{
  heading: ReactNode;
  features: SubscriptionFeature[];
  headingSx?: TypographyProps["sx"];
}> = ({ features, heading, headingSx }) => (
  <>
    <Typography gutterBottom component="p" variant="bpSmallCopy" sx={headingSx}>
      {heading}
    </Typography>
    <Box component="ul">
      {features.map((feature, index) => (
        <SubscriptionFeatureListItem
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          feature={feature}
        />
      ))}
    </Box>
  </>
);
