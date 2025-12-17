import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { m, Variants } from "framer-motion";
import Image from "next/legacy/image";

import helixBoxes from "../../../../public/assets/new-home/helix-boxes.webp";
import { DESKTOP_NAVBAR_HEIGHT, MOBILE_NAVBAR_HEIGHT } from "../../navbar";

const fadeInWrapper: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const fadeInAndMoveDownChildren: Variants = {
  hidden: { opacity: 0, translateY: -15 },
  show: { opacity: 1, translateY: 0 },
};

const fadeInChildren: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const BaseAnimatedTypography = m(Typography);

const AnimatedTypography = (
  props: React.ComponentProps<typeof BaseAnimatedTypography>,
) => (
  <BaseAnimatedTypography
    variants={fadeInAndMoveDownChildren}
    transition={{ duration: 0.4, ease: "easeOut" }}
    {...props}
  />
);

export const Header = () => {
  const theme = useTheme();

  const sm = useMediaQuery(theme.breakpoints.up("sm"));
  const md = useMediaQuery(theme.breakpoints.up("md"));
  const height = md ? DESKTOP_NAVBAR_HEIGHT : MOBILE_NAVBAR_HEIGHT;

  return (
    <Box
      component={m.div}
      variants={fadeInWrapper}
      initial="hidden"
      animate="show"
      sx={{
        background:
          "radial-gradient(116.02% 95.04% at 50% 100.79%, #F3F0F9 0%, #FFFFFF 70.54%)",
        pb: { xs: 12, md: 18 },
        borderBottom: `1px solid #edeaf1`,
        position: "relative",
      }}
    >
      <Container
        sx={{
          position: "relative",
          zIndex: 3,
          pt: {
            xs: `calc(128px - ${height}px)`,
            md: `calc(160px - ${height}px)`,
          },
          mb: { xs: 6, md: 10 },
          maxWidth: { xs: "95%", md: "75%", lg: "60%" },
        }}
      >
        <AnimatedTypography
          sx={{
            textTransform: "uppercase",
            color: ({ palette }) => palette.purple[800],
            mb: 2.5,
            fontWeight: 500,
            mx: "auto",
          }}
          textAlign="center"
          variant="bpSmallCaps"
        >
          The Block Protocol
        </AnimatedTypography>
        <AnimatedTypography
          variant="bpHeading1"
          textAlign="center"
          sx={{
            lineHeight: 1,
            color: ({ palette }) => palette.gray[90],
            mb: 2.5,
            // @todo font-size should match design system
            fontSize: "clamp(3rem, 5vw, 7rem)",
            fontStyle: "italic",
            letterSpacing: "-0.02em",
          }}
        >
          The open standard for {sm ? <br /> : null}
          block-based apps
        </AnimatedTypography>
        <AnimatedTypography
          variant="bpBodyCopy"
          lineHeight={1.4}
          color={theme.palette.gray[70]}
          textAlign="center"
          sx={{
            color: ({ palette }) => palette.gray[90],
            margin: "0 auto",
            fontSize: { xs: "1.25rem", md: "1.45rem" },
          }}
        >
          The{" "}
          <strong>
            <Box
              component="span"
              sx={{ color: ({ palette }) => palette.purple[70] }}
            >
              Þ
            </Box>{" "}
            Block Protocol
          </strong>{" "}
          enables applications to make their interfaces infinitely extensible
          with interoperable components known as blocks
        </AnimatedTypography>
      </Container>
      <m.div variants={fadeInChildren} transition={{ duration: 0.3 }}>
        <Image
          layout="responsive"
          src={helixBoxes}
          style={{ zIndex: 999 }}
          /**
           * not using placeholder="blur" on this image, since it's transparent, making it blur looks weird
           * `priority` makes sure this image is loaded ASAP, because this is the first image in the homepage
           */
          priority
        />
      </m.div>
    </Box>
  );
};
