import { Box, Grid, GridProps, Typography, useTheme } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

import { FadeInOnViewport } from "../../fade-in-on-viewport";

export interface IconSectionProps {
  color: string;
  icon: ReactNode;
  title: ReactNode;
  grayTitle?: ReactNode;
  description: ReactNode;
  action?: ReactNode;
  maxWidth?: number;
}

export const IconSection: FunctionComponent<GridProps & IconSectionProps> = ({
  color,
  icon,
  title,
  grayTitle,
  description,
  action,
  maxWidth,
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
            pl: { xs: "15px", lg: "45px" },
            pr: { xs: "16px", lg: "83px" },
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
            maxWidth: "447px",
            padding: {
              xs: "2rem",
              sm: "1rem",
              md: "2rem",
            },
          }}
        >
          <Box sx={{ mb: "1rem" }}>{icon}</Box>
          <Typography
            sx={{ color, mb: 1 }}
            variant="bpLargeText"
            fontWeight={400}
            fontSize="26px"
            component="div"
          >
            for <strong> {title} </strong>
            {grayTitle ? (
              <Box component="span" sx={{ color: theme.palette.gray[50] }}>
                {grayTitle}
              </Box>
            ) : null}
          </Typography>
          <Typography
            variant="bpSmallCopy"
            sx={{ fontWeight: 400, lineHeight: 1.2, mb: "24px", maxWidth }}
          >
            {description}
          </Typography>
          {action}
        </Box>
      </FadeInOnViewport>
    </Grid>
  );
};
