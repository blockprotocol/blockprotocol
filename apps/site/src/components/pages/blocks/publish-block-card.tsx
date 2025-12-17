import { Box, styled, Typography } from "@mui/material";

import { LinkButton } from "../../link-button";

interface PublishBlockCardProps {
  publishFrom: string;
  description: string;
  href?: string;
  logoSrc: string;
}

const Wrapper = styled(Box)(({ theme }) =>
  theme.unstable_sx({
    display: "flex",
    alignItems: "center",
    p: theme.spacing(2.5, 3),
    gap: 3,
    border: `1px solid ${theme.palette.gray[30]}`,
    borderRadius: 1,
    transition: theme.transitions.create("border-color"),

    "&:hover": {
      borderColor: theme.palette.purple[40],
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "flex-start",

      "& :last-child": {
        width: "100%",
      },
    },
  }),
);

export const PublishBlockCard = ({
  publishFrom,
  description,
  href,
  logoSrc,
}: PublishBlockCardProps) => {
  return (
    <Wrapper>
      <Box component="img" src={logoSrc} />

      <Box sx={{ flex: 1, opacity: href ? 1 : 0.5 }}>
        <Typography variant="bpHeading5" fontWeight={500} mb={0.5}>
          Publish from{" "}
          <Box component="b" sx={{ color: "common.black" }}>
            {publishFrom}
          </Box>
        </Typography>
        <Typography variant="bpSmallCopy" sx={{ color: "gray.70" }}>
          {description}
        </Typography>
      </Box>

      {href ? (
        <LinkButton href={href} size="small" squared>
          Continue
        </LinkButton>
      ) : (
        <Typography
          variant="bpSmallCaps"
          textAlign="center"
          fontWeight="600"
          sx={{ color: "gray.60" }}
        >
          Coming Soon
        </Typography>
      )}
    </Wrapper>
  );
};
