import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowRight,
  faBoxOpen,
  faCheck,
  faCode,
  faInfinity,
  faUser,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import Image from "next/legacy/image";
import { FunctionComponent, ReactNode } from "react";

import helix from "../../../../public/assets/pricing/helix.png";
import { FontAwesomeIcon } from "../../icons";
import { faCloud } from "../../icons/pro/fa-cloud";
import { faCubes } from "../../icons/pro/fa-cubes";
import { faEye } from "../../icons/pro/fa-eye";
import { faHammer } from "../../icons/pro/fa-hammer";
import { faServer } from "../../icons/pro/fa-server";
import { faWindow } from "../../icons/pro/fa-window";
import { CustomLink } from "./custom-link";
import { CustomLinkButton } from "./custom-link-button";
import { GradientFontAwesomeIcon } from "./gradient-fontawesome-icon";

interface DescriptionItem {
  icon: IconDefinition;
  text: ReactNode;
}

interface SectionProps {
  typeIcon: IconDefinition;
  type: "users" | "developers" | "embedders";
  descriptionItems: DescriptionItem[];
  signedIn: boolean;
}

const Section = ({
  typeIcon,
  type,
  descriptionItems,
  signedIn,
}: SectionProps) => {
  return (
    <Box
      sx={{
        width: 343,
        marginX: "auto",
      }}
    >
      <Paper
        sx={{
          background: "transparent",
          overflow: "hidden",
          boxShadow: "0px 4.23704px 8.1px rgba(61, 78, 133, 0.06)",
        }}
      >
        <Stack
          sx={{
            background:
              "linear-gradient(180.53deg, rgba(247, 245, 255, 0.66) 14.12%, #FFFFFF 83.7%)",
            border: ({ palette }) => `2px solid ${palette.common.white}`,
            backdropFilter: "blur(7.5px)",
            padding: 4.25,
            justifyContent: "center",
            alignItems: "center",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottomWidth: 0,
          }}
        >
          <GradientFontAwesomeIcon
            icon={typeIcon}
            sx={{ mt: 0.75, mb: 2.25, height: 27, width: 49 }}
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
            sx={{
              letterSpacing: "-0.02em",
              fontSize: "1.625rem",
              whiteSpace: "nowrap",
            }}
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
              <GradientFontAwesomeIcon
                icon={icon}
                sx={{ height: 15, width: 20 }}
              />

              <Typography variant="bpBodyCopy" sx={{ lineHeight: 1.2 }}>
                {text}
              </Typography>
            </Stack>
          ))}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 0.25,
              mt: 2.25,
            }}
          >
            <CustomLinkButton
              href="/signup"
              disabled={signedIn}
              endIcon={
                <FontAwesomeIcon icon={signedIn ? faCheck : faArrowRight} />
              }
            >
              {signedIn ? "Included with all accounts" : "Create account"}
            </CustomLinkButton>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export const FreeTierSection: FunctionComponent<{
  signedIn: boolean;
}> = ({ signedIn }) => {
  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ position: "absolute", width: 1, top: 34 }}>
        <Image layout="responsive" src={helix} />
      </Box>

      <Container
        sx={{
          position: "relative",
          mb: { xs: 8, md: 12.5 },
          maxWidth: { md: 800, lg: 1200 },
          px: "6.5%",
        }}
      >
        <Typography
          variant="bpHeading4"
          sx={{ textTransform: "uppercase", mb: 1.75, lineHeight: 1.4 }}
        >
          <strong>Free</strong>{" "}
          <Box
            component="span"
            sx={{ color: ({ palette }) => palette.gray[60] }}
          >
            for everyone
          </Box>
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 4,
            maxWidth: { md: 718, lg: 1093 },
          }}
        >
          <Section
            typeIcon={faUser}
            type="users"
            descriptionItems={[
              {
                icon: faCubes,
                text: (
                  <>
                    <strong>Access to all public blocks</strong> on the{" "}
                    <CustomLink href="/hub">Þ Hub</CustomLink>
                  </>
                ),
              },
              {
                icon: faBoxOpen,
                text: (
                  <>
                    <strong>Multi-app support:</strong>{" "}
                    <CustomLink href="/docs/using-blocks#github-blocks">
                      GitHub
                    </CustomLink>
                    ,{" "}
                    <CustomLink href="/docs/using-blocks#wordpress">
                      WordPress
                    </CustomLink>
                    ,{" "}
                    <CustomLink href="/docs/using-blocks#figma">
                      Figma
                    </CustomLink>
                    , and{" "}
                    <CustomLink href="/docs/using-blocks#hash">HASH</CustomLink>
                  </>
                ),
              },
              {
                icon: faInfinity,
                text: (
                  <>
                    <strong>Unlimited use,</strong> no limits on frequency or
                    duration of use
                  </>
                ),
              },
              {
                icon: faCloud,
                text: (
                  <>
                    <strong>Access APIs</strong> without having to sign up for
                    them individually
                  </>
                ),
              },
            ]}
            signedIn={signedIn}
          />

          <Section
            typeIcon={faCode}
            type="developers"
            descriptionItems={[
              {
                icon: faServer,
                text: (
                  <>
                    <strong>Host blocks and types</strong> on the{" "}
                    <CustomLink href="/hub">Þ Hub</CustomLink> for free, without
                    limits
                  </>
                ),
              },
              {
                icon: faDiscord,
                text: (
                  <>
                    <strong>Discord</strong> support server
                  </>
                ),
              },
              {
                icon: faHammer,
                text: (
                  <>
                    <strong>High-quality developer tools</strong> and
                    documentation provided
                  </>
                ),
              },
            ]}
            signedIn={signedIn}
          />

          <Section
            typeIcon={faWindow}
            type="embedders"
            descriptionItems={[
              {
                icon: faCubes,
                text: (
                  <>
                    <strong>Access to all public blocks</strong> on the{" "}
                    <CustomLink href="/hub">Þ Hub</CustomLink>
                  </>
                ),
              },
              {
                icon: faInfinity,
                text: (
                  <>
                    <strong>Unlimited instances</strong> of blocks embeddable in
                    your app or site
                  </>
                ),
              },
              {
                icon: faEye,
                text: (
                  <>
                    <strong>Unlimited pageviews</strong> served to your users
                  </>
                ),
              },
            ]}
            signedIn={signedIn}
          />
        </Box>
      </Container>
    </Box>
  );
};
