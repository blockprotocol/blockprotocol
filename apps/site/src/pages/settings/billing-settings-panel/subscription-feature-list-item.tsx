import { Box, Typography } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

export type SubscriptionFeature = {
  icon: ReactNode;
  title: ReactNode;
  planned?: boolean;
};

export const SubscriptionFeatureListItem: FunctionComponent<{
  feature: SubscriptionFeature;
}> = ({ feature: { icon, title, planned } }) => (
  <Box component="li" display="flex" alignItems="center" marginBottom={1}>
    <Box marginRight={2}>{icon}</Box>
    <Typography variant="bpSmallCopy">
      {title}
      {planned ? (
        <Box
          component="span"
          sx={{
            marginLeft: 1,
            fontWeight: 600,
            textTransform: "uppercase",
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(96.93deg, #6834FB 18.76%, #FF45EC 49.79%);",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Planned
        </Box>
      ) : null}
    </Typography>
  </Box>
);
