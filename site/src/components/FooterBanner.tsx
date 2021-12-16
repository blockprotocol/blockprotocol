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
import { Button } from "./Button";
import { Link } from "./Link";
import backgroundRainbow from "../../public/assets/background-corner-rainbow.png";
import { BoltIcon } from "./SvgIcon/BoltIcon";

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

const BannerCard: FC<BannerCardProps> = ({
  sx,
  contents,
  buttonHref,
  buttonText,
}) => (
  <Paper
    sx={{
      transition: (theme) => theme.transitions.create("padding"),
      padding: 4,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      position: "relative",
      "&::before": {
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        content: `""`,
        /** @todo: figure out IE compatiblity? (https://caniuse.com/mdn-css_properties_mix-blend-mode) */
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
    <Link href={buttonHref}>
      <a>
        <Button
          sx={{
            textTransform: "none",
          }}
          variant="primary"
          startIcon={<BoltIcon />}
        >
          <Typography>{buttonText}</Typography>
        </Button>
      </a>
    </Link>
  </Paper>
);

export const BANNERS: Banner[] = [
  {
    shouldDisplay: ({ pathname }) => pathname.startsWith("/hub"),
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
              <Image width={250} height={250} src={backgroundRainbow} />
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
              sx={{ fontWeight: 700, color: ({ palette }) => palette.gray[60] }}
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
              <Link href="/docs/blocks">
                <a>Quickstart guide</a>
              </Link>{" "}
              to start building your own blocks.
            </Typography>
          </Box>
        }
        buttonHref="/docs/blocks"
        buttonText="Read the Embedding Guide"
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
                  sx={{ fontWeight: 700 }}
                >
                  Add blocks to your App
                </Typography>
                <Typography component="p" variant="bpBodyCopy">
                  Anyone with an existing application who wants to embed
                  semantically-rich, reusable blocks in their product can use
                  the protocol. Improve your app’s utility and tap into a world
                  of structured data with no extra effort, for free.{" "}
                </Typography>
              </Box>
            }
            buttonHref="/docs/embedding"
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
                  sx={{ fontWeight: 700 }}
                >
                  Build your own blocks
                </Typography>
                <Typography component="p" variant="bpBodyCopy">
                  Any developer can build and publish blocks to the global
                  registry for other developers to use. Contribute to an open
                  source community changing the landscape of interoperable data.
                </Typography>
              </Box>
            }
            buttonHref="/"
            buttonText="Read the Quickstart Guide"
          />
        </Grid>
      </Grid>
    ),
  },
  {
    shouldDisplay: ({ pathname }) => pathname.startsWith("/[org]/[block]"),
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
              <Image width={250} height={250} src={backgroundRainbow} />
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
              sx={{ fontWeight: 700, color: ({ palette }) => palette.gray[60] }}
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
              <Link href="/docs/blocks">
                <a>Quickstart guide</a>
              </Link>{" "}
              to start building your own blocks.
            </Typography>
          </Box>
        }
        buttonHref="/docs/blocks"
        buttonText="Read the Embedding Guide"
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
      paddingTop: banner.overlapsFooter ? 0 : (theme) => theme.spacing(8),
      /** @todo: tweak to better match designs */
      background: `radial-gradient(
              circle at 0% 100%,
              #FFB172 0%,
              #9482FF 50%,
              #84E6FF 100%
            )`,
    }}
  >
    <Container
      sx={{
        paddingTop: {
          xs: banner.overlapsFooter ? 8 : 0,
          md: banner.overlapsFooter ? 10 : 0,
        },
        marginBottom: {
          xs: banner.overlapsFooter ? -8 : 0,
          md: banner.overlapsFooter ? -10 : 0,
        },
      }}
    >
      {banner.contents}
    </Container>
  </Box>
);
