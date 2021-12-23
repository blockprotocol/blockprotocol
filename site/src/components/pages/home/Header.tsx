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
import { Link } from "../../Link";

export const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Box
      sx={{
        background:
          "radial-gradient(113.45% 113.45% at 50% -13.45%, #3F4656 0.52%, #1C1C29 100%)",
        minHeight: "95vh",
        position: "relative",
        overflowX: "hidden",
        mb: { xs: 10, lg: 16 },
      }}
    >
      <Container sx={{ pt: { xs: "15vh", lg: "20vh" }, mb: { xs: 20, lg: 0 } }}>
        <Box
          sx={{
            width: { xs: "100%", lg: "57%" },
            maxWidth: 660,
            mx: { xs: "auto", lg: "unset" },
            textAlign: { xs: "center", lg: "left" },
          }}
        >
          <Typography
            sx={{
              textTransform: "uppercase",
              color: ({ palette }) => palette.purple[400],
              mb: 4,
              letterSpacing: "5%",
              width: { lg: "100%" },
              mx: "auto",
            }}
            variant="bpSmallCaps"
          >
            A powerful {isMobile && <br />} new protocol for developers
          </Typography>
          <Typography
            variant="bpHeading1"
            sx={{
              lineHeight: 1,
              color: "white",
              mb: 4,
              // @todo font-size should match design system
              fontSize: { xs: 40, lg: 60 },
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
            width={{ xs: "100%", lg: "74%" }}
            textAlign={{ xs: "center", lg: "left" }}
          >
            An open standard for building
            <strong> blocks connected to structured data </strong>
            with <strong>schemas</strong>. Make your applications both human and
            machine-readable.
          </Typography>
          <Link href="/docs/developing-blocks">
            <Button startIcon={<BoltIcon />}>Read the Quickstart Guide</Button>
          </Link>
        </Box>
      </Container>

      <Box
        sx={{
          height: { xs: "auto", lg: "40vh" },
          width: { xs: "100%", lg: "auto" },
          position: { xs: "relative", lg: "absolute" },
          bottom: { xs: 0, lg: "15%" },
          right: 0,
          transform: { xs: "unset", lg: "translateX(10%)" },
          display: "flex",
          justifyContent: "center",
          "::after": {
            content: `""`,
            position: "absolute",
            top: { xs: "50%", lg: 0 },
            bottom: 0,
            right: 0,
            width: { xs: "100%", lg: "40%" },
            background: {
              xs: `linear-gradient(0deg, #2A2B37 1.28%, transparent 89.29%)`,
              lg: `linear-gradient(270.33deg, #2A2B37 1.28%, transparent 89.29%)`,
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
          sx={{
            boxShadow: 5,
            display: "block",
            height: { xs: "auto", lg: "100%" },
            width: { xs: "80%", lg: "auto" },
            maxWidth: { xs: 400, lg: "unset" },
          }}
        />
      </Box>
    </Box>
  );
};
