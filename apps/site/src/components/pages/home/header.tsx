import { Box, Container, Typography, useTheme } from "@mui/material";
import _Image from "next/image.js";

import primaryHelixImage from "../../../../public/assets/new-home/primary-helix-min.png";

const Image = _Image as unknown as typeof _Image.default;

export const Header = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background:
          "radial-gradient(116.02% 95.04% at 50% 100.79%, #F3F0F9 0%, #FFFFFF 70.54%)",
        pb: { xs: 20, md: 28 },
        borderBottom: `1px solid #edeaf1`,
        position: "relative",
      }}
    >
      <Container
        sx={{
          position: "relative",
          zIndex: 3,
          pt: { xs: 16, md: 20 },
          mb: { xs: 6, md: 10 },
          maxWidth: { xs: "95%", md: "75%", lg: "60%" },
        }}
      >
        <Typography
          sx={{
            textTransform: "uppercase",
            color: ({ palette }) => palette.purple[700],
            mb: 3,
            fontWeight: 500,
            letterSpacing: "0.06rem",
            mx: "auto",
          }}
          textAlign="center"
          variant="bpSmallCaps"
        >
          A powerful{" "}
          <span style={{ display: "inline-block" }}>
            new protocol for developers
          </span>
        </Typography>
        <Typography
          variant="bpHeading1"
          textAlign="center"
          sx={{
            lineHeight: 1,
            color: ({ palette }) => palette.gray[90],
            mb: 3,
            // @todo font-size should match design system
            fontSize: "clamp(3rem, 5vw, 7rem)",
          }}
        >
          The open standard for building block-based interfaces
        </Typography>
        <Typography
          variant="bpBodyCopy"
          lineHeight={1.4}
          color={theme.palette.gray[70]}
          textAlign="center"
          sx={{
            margin: "0 auto",
            maxWidth: "45ch",
            fontSize: { xs: "1.25rem", md: "1.45rem" },
          }}
        >
          The Block Protocol enables applications to make their interfaces
          infinitely extensible with interoperable components called blocks.
        </Typography>
      </Container>
      <Image layout="responsive" src={primaryHelixImage} />
    </Box>
  );
};
