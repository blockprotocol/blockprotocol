import { Box, Grid, GridProps } from "@mui/material";
import { FunctionComponent } from "react";

import { FadeInOnViewport } from "../../fade-in-on-viewport";

export const DetailsSection: FunctionComponent<GridProps> = ({
  children,
  sx,
  ...props
}) => {
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
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <FadeInOnViewport>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginButtom: "100px",
          }}
        >
          {children}
        </Box>
      </FadeInOnViewport>
    </Grid>
  );
};
