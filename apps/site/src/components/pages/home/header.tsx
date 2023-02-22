import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/legacy/image";

import helixBoxes from "../../../../public/assets/new-home/helix-boxes.webp";
import { DESKTOP_NAVBAR_HEIGHT, MOBILE_NAVBAR_HEIGHT } from "../../navbar";

export const Header = () => {
  const theme = useTheme();

  const sm = useMediaQuery(theme.breakpoints.up("sm"));
  const md = useMediaQuery(theme.breakpoints.up("md"));
  const height = md ? DESKTOP_NAVBAR_HEIGHT : MOBILE_NAVBAR_HEIGHT;

  return (
    <Box
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
        <Typography
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
        </Typography>
        <Typography
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
        </Typography>
        <Typography
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
        </Typography>
      </Container>
      <Image layout="responsive" src={helixBoxes} style={{ zIndex: 999 }} />
    </Box>
  );
};
