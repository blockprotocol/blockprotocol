import { useMediaQuery, useTheme } from "@mui/material";

import { Button, ButtonProps } from "../../../components/button";

export const AvatarButton = (props: ButtonProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Button
      squared
      variant="tertiary"
      size={isMobile ? "medium" : "small"}
      color="gray"
      fullWidth={isMobile}
      {...props}
    />
  );
};
