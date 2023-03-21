import { Box, BoxProps } from "@mui/material";
import { m } from "framer-motion";
import { ReactNode } from "react";

export const FadeInOnViewport = ({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: BoxProps["sx"];
}) => {
  return (
    <Box
      component={m.div}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
      sx={sx}
    >
      {children}
    </Box>
  );
};
