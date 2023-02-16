import {
  faArrowRight,
  faBoxOpen,
  faCloud,
  faCubes,
  faInfinity,
  faUser,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import Image from "next/legacy/image";
import { FunctionComponent, ReactNode } from "react";

import helix from "../../../../public/assets/pricing/helix.png";
import { FontAwesomeIcon, FontAwesomeIconProps } from "../../icons";
import { LinkButton } from "../../link-button";

const GradientFontAwesomeIcon: FunctionComponent<FontAwesomeIconProps> = ({
  sx,
  ...props
}) => (
  <FontAwesomeIcon
    {...props}
    sx={[{ fill: "url(#gradient)" }, ...(Array.isArray(sx) ? sx : [sx])]}
  >
    <linearGradient
      id="gradient"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
      gradientTransform="rotate(96.94deg)"
    >
      <stop offset="30.81%" stopColor="#6834FB" />
      <stop offset="92.56%" stopColor="#FF45EC" />
    </linearGradient>
  </FontAwesomeIcon>
);

interface DescriptionItem {
  icon: IconDefinition;
  text: ReactNode;
}

interface SectionProps {
  typeIcon: IconDefinition;
  type: "users" | "developers" | "embedders";
  descriptionItems: DescriptionItem[];
  callToAction: ReactNode;
}

const Section = ({
  typeIcon,
  type,
  descriptionItems,
  callToAction,
}: SectionProps) => {
  return (
    <Paper sx={{ background: "transparent", overflow: "hidden" }}>
      <Stack
        sx={{
          background:
            "linear-gradient(180.53deg, rgba(247, 245, 255, 0.66) 14.12%, #FFFFFF 83.7%)",
          border: ({ palette }) => `2px solid ${palette.common.white}`,
          backdropFilter: "blur(7.5px)",
          padding: 5,
          justifyContent: "center",
          alignItems: "center",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderBottomWidth: 0,
        }}
      >
        <GradientFontAwesomeIcon
          icon={typeIcon}
          sx={{ mb: 2.25, fontSize: 27 }}
        />

        <Typography
          variant="bpHeading1"
          sx={{
            display: "inline-flex",
            mb: 0.75,
            background:
              "linear-gradient(96.94deg, #6834FB 30.81%, #FF45EC 92.56%)",
            backgroundClip: "text",
            textFillColor: "transparent",
            fontSize: "2.625rem",
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            lineHeight: 0.96,
            fontStyle: "italic",
          }}
        >
          Free
        </Typography>

        <Typography
          variant="bpHeading2"
          sx={{ mb: 2, letterSpacing: "-0.02em", fontSize: "1.625rem" }}
        >
          for <strong>{type}</strong> of blocks
        </Typography>
      </Stack>
      <Stack
        sx={({ palette }) => ({
          padding: 4.25,
          rowGap: 1.5,
          borderTop: `1px solid ${palette.purple[30]}`,
          background: palette.common.white,
        })}
      >
        {descriptionItems.map(({ icon, text }, index) => (
          <Stack
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            sx={{
              flexDirection: "row",
              alignItems: "center",
              gap: 2.25,
            }}
          >
            <GradientFontAwesomeIcon icon={icon} sx={{ fontSize: 27 }} />

            {text}
          </Stack>
        ))}

        <Box
          sx={{ display: "flex", justifyContent: "center", mb: 0.25, mt: 2.25 }}
        >
          {callToAction}
        </Box>
      </Stack>
    </Paper>
  );
};

export const FreeTierSection: FunctionComponent = () => {
  return (
    <Box sx={{ position: "relative" }}>
      <Image layout="responsive" src={helix} />
      <Container
        sx={{
          zIndex: 3,
          mb: { xs: 6, md: 10 },
          maxWidth: { xs: "95%", md: "75%", lg: "60%" },
        }}
      >
        <Box sx={{ position: "absolute", top: 0 }}>
          <Section
            typeIcon={faUser}
            type="users"
            descriptionItems={[
              {
                icon: faCubes,
                text: "Access to all public blocks on the Þ Hub",
              },
              {
                icon: faBoxOpen,
                text: "Multi-app support: GitHub, WordPress, Figma, and HASH.",
              },
              {
                icon: faInfinity,
                text: "Unlimited use, no limits on frequency or duration of use",
              },
              {
                icon: faCloud,
                text: "Access APIs without having to sign up for them individually",
              },
            ]}
            callToAction={
              <LinkButton
                href="/signup"
                size="small"
                variant="primary"
                endIcon={<FontAwesomeIcon icon={faArrowRight} />}
                sx={({ palette }) => ({
                  color: palette.bpGray[20],
                  background: palette.purple[700],
                })}
              >
                Create account
              </LinkButton>
            }
          />
        </Box>
      </Container>
    </Box>
  );
};
