import { FC, ReactNode } from "react";
import {
  Box,
  Container,
  Paper,
  Grid,
  Typography,
  PaperProps,
} from "@mui/material";
import Image from "next/image";
import { Link } from "./Link";
import { BoltIcon } from "./icons";
import { LinkButton } from "./LinkButton";

type Banner = {
  shouldDisplay: (params: { pathname: string }) => boolean;
  contents: ReactNode;
  overlapsFooter?: boolean;
};

type BannerCardProps = {
  sx?: PaperProps["sx"];
  contents: ReactNode;
  buttonHref: string;
  buttonText: ReactNode;
};

const BackgroundRainbow: FC = () => {
  return (
    <Image
      width={250}
      height={250}
      src="/assets/background-corner-rainbow.png"
    />
  );
};

const BannerCard: FC<BannerCardProps> = ({
  sx,
  contents,
  buttonHref,
  buttonText,
}) => (
  <Paper
    sx={{
      transition: (theme) => theme.transitions.create("padding"),
      padding: { xs: 4, md: 6 },
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      position: "relative",
      "&::before": {
        pointerEvents: "none",
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        content: `""`,
        /** @todo: figure out IE compatibility? (https://caniuse.com/mdn-css_properties_mix-blend-mode) */
        mixBlendMode: "multiply",
        boxShadow: [
          "0px 4.46px 3px 0px #7F8FAB1F",
          "0px 14.97px 16px 0px #7F8FAB33",
          "0px 67px 60px 0px #7F8FAB4D",
        ].join(","),
      },
      ...sx,
    }}
  >
    <Box mb={2}>{contents}</Box>
    <LinkButton
      href={buttonHref}
      sx={{
        textTransform: "none",
      }}
      variant="primary"
      startIcon={<BoltIcon />}
    >
      {buttonText}
    </LinkButton>
  </Paper>
);

export const BANNERS: Banner[] = [
  {
    shouldDisplay: ({ pathname }) => pathname === "/hub",
    overlapsFooter: true,
    contents: (
      <BannerCard
        sx={{
          padding: (theme) => ({
            xs: theme.spacing(4),
            md: theme.spacing(8),
          }),
        }}
        contents={
          <Box mb={2}>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                opacity: {
                  md: 1,
                  xs: 0,
                },
                transition: (theme) => theme.transitions.create("opacity"),
              }}
            >
              <BackgroundRainbow />
            </Box>
            <Typography
              component="h2"
              variant="bpHeading2"
              sx={{ fontWeight: 700 }}
            >
              Don't see the block you need?
            </Typography>
            <Typography
              component="h2"
              variant="bpHeading2"
              sx={{ fontWeight: 700, color: ({ palette }) => palette.gray[70] }}
            >
              You can build it!
            </Typography>
            <Typography
              component="p"
              variant="bpBodyCopy"
              sx={{ maxWidth: 650 }}
            >
              Anyone can create blocks and contribute to this growing,
              open-source registry of blocks. Read our{" "}
              <Link href="/docs/developing-blocks">
                <a>Quickstart guide</a>
              </Link>{" "}
              to start building your own blocks.
            </Typography>
          </Box>
        }
        buttonHref="/docs/developing-blocks"
        buttonText="Read the Quick Start Guide"
      />
    ),
  },
  {
    shouldDisplay: ({ pathname }) =>
      pathname.startsWith("/spec") || pathname === "/",
    overlapsFooter: true,
    contents: (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <BannerCard
            contents={
              <Box mb={2}>
                <Typography
                  component="h2"
                  variant="bpHeading2"
                  sx={{ fontWeight: 700, marginBottom: 2 }}
                >
                  Add blocks to your app
                </Typography>
                <Typography component="p" variant="bpBodyCopy">
                  Anyone with an existing application who wants to embed
                  semantically-rich, reusable blocks in their product can use
                  the protocol. Improve your app’s utility and tap into a world
                  of structured data with no extra effort, for free.{" "}
                </Typography>
              </Box>
            }
            buttonHref="/docs/embedding-blocks"
            buttonText="Read the Embedding Guide"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <BannerCard
            contents={
              <Box mb={2}>
                <Typography
                  component="h2"
                  variant="bpHeading2"
                  sx={{ fontWeight: 700, marginBottom: 2 }}
                >
                  Build your own blocks
                </Typography>
                <Typography component="p" variant="bpBodyCopy">
                  Any developer can build and publish blocks to the global
                  registry for other developers to use. Create blocks that solve
                  real-world problems, and contribute to an open source
                  community changing the landscape of interoperable data.
                </Typography>
              </Box>
            }
            buttonHref="/docs/developing-blocks"
            buttonText="Read the Quickstart Guide"
          />
        </Grid>
      </Grid>
    ),
  },
  {
    shouldDisplay: ({ pathname }) => pathname === "/[org]/[block]",
    overlapsFooter: true,
    contents: (
      <BannerCard
        sx={{
          padding: (theme) => ({
            xs: theme.spacing(4),
            md: theme.spacing(8),
          }),
        }}
        contents={
          <Box mb={2}>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                opacity: {
                  md: 1,
                  xs: 0,
                },
                transition: (theme) => theme.transitions.create("opacity"),
              }}
            >
              <BackgroundRainbow />
            </Box>
            <Typography
              component="h2"
              variant="bpHeading2"
              sx={{ fontWeight: 700 }}
            >
              Ready to build your own blocks?
            </Typography>
            <Typography
              component="h2"
              variant="bpHeading2"
              sx={{ fontWeight: 700, color: ({ palette }) => palette.gray[70] }}
            >
              Anyone can contribute
            </Typography>
            <Typography
              component="p"
              variant="bpBodyCopy"
              sx={{ maxWidth: 650 }}
            >
              Anyone can create blocks and contribute to this growing,
              open-source registry of blocks. Read our{" "}
              <Link href="/docs/developing-blocks">
                <a>Quickstart guide</a>
              </Link>{" "}
              to start building your own blocks.
            </Typography>
          </Box>
        }
        buttonHref="/docs/developing-blocks"
        buttonText="Read the Quick Start Guide"
      />
    ),
  },
];

type FooterBannerProps = {
  banner: Banner;
};

export const FooterBanner: FC<FooterBannerProps> = ({ banner }) => (
  <Box
    sx={{
      paddingTop: banner.overlapsFooter ? 0 : 8,
      background: `radial-gradient(
              ellipse at 10% 130%,
              #ffac67 0%,
              #9582ff 55%,
              #79e4ff 100%
            )`,
    }}
  >
    <Container
      sx={{
        paddingTop: {
          xs: banner.overlapsFooter ? 8 : 0,
          md: banner.overlapsFooter ? 10 : 0,
        },
        marginBottom: banner.overlapsFooter ? -8 : 0,
      }}
    >
      {banner.contents}
    </Container>
  </Box>
);
