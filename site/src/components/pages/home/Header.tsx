import React from "react";
import {
  Container,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Button } from "../../Button";
import { BoltIcon } from "../../SvgIcon/BoltIcon";

export const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        background:
          "radial-gradient(113.45% 113.45% at 50% -13.45%, #3F4656 0.52%, #1C1C29 100%)",
        minHeight: "95vh",
        position: "relative",
        overflowX: "hidden",
        mb: { xs: 10, md: 16 },
      }}
    >
      <Container sx={{ pt: { xs: "15vh", md: "20vh" }, mb: { xs: 20, md: 0 } }}>
        <Box
          sx={{
            width: { xs: "100%", md: "57%" },
            maxWidth: 660,
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography
            sx={{
              textTransform: "uppercase",
              color: ({ palette }) => palette.purple[400],
              mb: 4,
              letterSpacing: "5%",
              width: { xs: "55%", md: "100%" },
              mx: "auto",
            }}
            variant="bpSmallCaps"
          >
            A powerful new protocol for developers
          </Typography>
          <Typography
            variant="bpHeading1"
            sx={{
              lineHeight: 1,
              color: "white",
              mb: 4,
              // @todo font-size should match design system
              fontSize: { xs: 40, md: 60 },
            }}
          >
            Build interactive blocks connected to the world of{" "}
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
                ":after": {
                  content: "''",
                  position: "absolute",
                  top: "100%",
                  height: 4,
                  left: 0,
                  width: "100%",
                  background:
                    "linear-gradient(90deg, #6B54EF 1.95%, rgba(107, 84, 239, 0) 100%)",
                },
              }}
              component="span"
            >
              structured data
            </Box>
          </Typography>
          <Typography
            variant="body1"
            color={theme.palette.purple[300]}
            mb={4}
            width={{ xs: "100%", md: "74%" }}
            textAlign={{ xs: "center", md: "left" }}
          >
            An open standard for building
            <strong> blocks connected to structured data </strong>
            with <strong>schemas</strong>. Make your applications both human and
            machine-readable.
          </Typography>
          <Button startIcon={<BoltIcon />}>Read the Quickstart Guide</Button>
        </Box>
      </Container>

      <Box
        sx={{
          height: { xs: "auto", md: "40vh" },
          width: { xs: "100%", md: "auto" },
          position: { xs: "relative", md: "absolute" },
          bottom: { xs: 0, md: "15%" },
          right: 0,
          transform: { xs: "unset", md: "translateX(10%)" },
          "::after": {
            content: `""`,
            position: "absolute",
            top: { xs: "50%", md: 0 },
            bottom: 0,
            right: 0,
            width: { xs: "100%", md: "40%" },
            background: {
              xs: `linear-gradient(0deg, #2A2B37 1.28%, transparent 89.29%)`,
              md: `linear-gradient(270.33deg, #2A2B37 1.28%, transparent 89.29%)`,
            },
          },
        }}
      >
        <Box
          component="img"
          src={
            isMobile
              ? "/assets/header-img-mobile.svg"
              : "/assets/header-img.svg"
          }
          sx={{ boxShadow: 5, display: "block", height: "100%" }}
        />
      </Box>
    </Box>
  );
};
