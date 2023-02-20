import { BoxProps, Stack, Typography, TypographyProps } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

import {
  SubscriptionFeature,
  SubscriptionFeatureListItem,
} from "./subscription-feature-list-item";

export const SubscriptionFeatureList: FunctionComponent<{
  features: SubscriptionFeature[];
  heading?: ReactNode;
  headingSx?: TypographyProps["sx"];
  gap?: BoxProps["gap"];
}> = ({ features, heading, headingSx, gap = 1.5 }) => (
  <>
    {heading ? (
      <Typography
        gutterBottom
        component="p"
        variant="bpSmallCopy"
        sx={[
          { fontFamily: "colfax-web" },
          ...(Array.isArray(headingSx) ? headingSx : [headingSx]),
        ]}
      >
        {heading}
      </Typography>
    ) : null}
    <Stack gap={gap}>
      {features.map((feature, index) => (
        <SubscriptionFeatureListItem
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          feature={feature}
        />
      ))}
    </Stack>
  </>
);
