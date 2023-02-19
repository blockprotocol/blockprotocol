import { Box, Typography, TypographyProps } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

export type SubscriptionFeature = {
  icon: ReactNode;
  title: ReactNode;
  planned?: boolean;
  plannedSx?: TypographyProps["sx"];
};

export const SubscriptionFeatureListItem: FunctionComponent<{
  feature: SubscriptionFeature;
}> = ({ feature: { icon, title, planned, plannedSx } }) => (
  <Box component="li" display="flex" alignItems="center" marginBottom={1}>
    <Box marginRight={2}>{icon}</Box>
    <Typography variant="bpSmallCopy" sx={{ fontWeight: 400, lineHeight: 1.2 }}>
      {title}
      {planned ? (
        <Typography
          component="span"
          variant="bpSmallCaps"
          sx={[
            {
              marginLeft: 1,
              fontWeight: 500,
              background:
                "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(96.93deg, #6834FB 18.76%, #FF45EC 49.79%);",
              backgroundClip: "text",
              color: "transparent",
              letterSpacing: "-0.02em",
            },
            ...(Array.isArray(plannedSx) ? plannedSx : [plannedSx]),
          ]}
        >
          Planned
        </Typography>
      ) : null}
    </Typography>
  </Box>
);
