import { Box, Grid, GridProps, Typography, useTheme } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

import { FadeInOnViewport } from "../../fade-in-on-viewport";

export interface IconSectionProps {
  color: string;
  icon: ReactNode;
  title: ReactNode;
  grayTitle?: ReactNode;
  description: ReactNode;
}

export const IconSection: FunctionComponent<GridProps & IconSectionProps> = ({
  color,
  icon,
  title,
  grayTitle,
  description,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Grid
      {...props}
      item
      sx={[
        ({ breakpoints }) => ({
          [breakpoints.up("lg")]: {
            display: "flex",
            justifyContent: "center",
          },
        }),
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      <FadeInOnViewport>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            color,
          }}
        >
          <Box sx={{ mb: 1.5 }}>{icon}</Box>
          <Typography
            sx={{ color, mb: 1 }}
            variant="bpLargeText"
            fontWeight={700}
          >
            {title}
            {grayTitle ? (
              <span style={{ color: theme.palette.gray[50] }}>{grayTitle}</span>
            ) : null}
          </Typography>
          <Typography
            variant="bpSmallCopy"
            sx={{ fontWeight: 400, lineHeight: 1.2 }}
          >
            {description}
          </Typography>
        </Box>
      </FadeInOnViewport>
    </Grid>
  );
};
