import { Typography } from "@mui/material";
import { PropsWithChildren } from "react";

export const RequiredLabel = ({ children }: PropsWithChildren) => (
  <>
    {children}
    <Typography
      variant="bpMicroCopy"
      fontWeight="700"
      component="span"
      sx={{ color: "purple.70", ml: 1 }}
    >
      REQUIRED
    </Typography>
  </>
);
