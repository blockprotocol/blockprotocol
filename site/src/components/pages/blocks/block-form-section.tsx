import { Box, Divider, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

type BlockFormSectionProps = PropsWithChildren<{ title: string }>;

export const BlockFormSection = ({
  children,
  title,
}: BlockFormSectionProps) => {
  return (
    <Box width="100%">
      <Typography
        variant="bpSmallCopy"
        textTransform="uppercase"
        fontWeight="700"
      >
        {title}
      </Typography>
      <Divider sx={{ mt: 1.5, mb: 4 }} />
      {children}
    </Box>
  );
};
