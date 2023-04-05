import { Box, Typography } from "@mui/material";

import { Button } from "../../../components/button";

export const LinkButtonWithIntroText = ({
  description,
  buttonTitle,
  buttonHref,
}: {
  description: string;
  buttonTitle: string;
  buttonHref: string;
}) => {
  return (
    <Box>
      <Typography
        sx={{
          maxWidth: "unset",
          mb: 1.25,
          color: "gray.70",
          fontSize: 14,
        }}
      >
        {description}
      </Typography>
      <Button
        href={buttonHref}
        squared
        variant="tertiary"
        size="small"
        color="gray"
      >
        {buttonTitle}
      </Button>
    </Box>
  );
};
