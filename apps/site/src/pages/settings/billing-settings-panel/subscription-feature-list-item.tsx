import { Box, Stack, Typography, TypographyProps } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

export type SubscriptionFeature = {
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  planned?: boolean;
  plannedSx?: TypographyProps["sx"];
  iconCentered?: boolean;
};

export const SubscriptionFeatureListItem: FunctionComponent<{
  feature: SubscriptionFeature;
}> = ({
  feature: { icon, title, description, planned, plannedSx, iconCentered },
}) => (
  <Box display="flex" alignItems="center">
    <Box
      marginRight={2}
      display="flex"
      alignSelf={iconCentered ? "center" : "flex-start"}
    >
      {icon}
    </Box>
    <Stack>
      <Typography
        variant="bpSmallCopy"
        sx={{ fontWeight: 400, lineHeight: 1.2 }}
      >
        {title}
        {planned ? (
          <Typography
            component="span"
            variant="bpMicroCopy"
            sx={[
              {
                marginLeft: 1,
                fontWeight: 500,
                background:
                  "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(96.93deg, #6834FB 18.76%, #FF45EC 49.79%);",
                backgroundClip: "text",
                color: "transparent",
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
              },
              ...(Array.isArray(plannedSx) ? plannedSx : [plannedSx]),
            ]}
          >
            Planned
          </Typography>
        ) : null}
      </Typography>
      {description ?? null}
    </Stack>
  </Box>
);
