import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { gsap } from "gsap";
import { Button } from "../../../Button";
import { BoltIcon } from "../../../SvgIcon/BoltIcon";
import { Link } from "../../../Link";
import { HeaderCard } from "./HeaderCard";

export const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    const tl = gsap
      .timeline()
      .fromTo(
        ".data-highlight",
        {
          background:
            "linear-gradient(90deg, #6B54EF 0%, rgba(107, 84, 239, 0) 0%)",
        },
        {
          background:
            "linear-gradient(90deg, #6B54EF 1.95%, rgba(107, 84, 239, 0) 100%)",
        },
        1,
      )
      .to(".background-balls", {
        x: "random(0, 100%)",
        y: "random(0, 100%)",
        duration: 3,
        ease: "none",
        repeat: -1,
        repeatRefresh: true,
      });

    return () => {
      tl.kill();
    };
  }, []);

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
      <Container
        sx={{
          position: "relative",
          zIndex: 2,
          pt: { xs: "15vh", lg: "20vh" },
          mb: { xs: 20, lg: 0 },
        }}
      >
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
              fontWeight: 500,
              letterSpacing: "5%",
              width: { lg: "100%" },
              mx: "auto",
            }}
            variant="bpSmallCaps"
          >
            A powerful{" "}
            <span style={{ display: "inline-block" }}>
              new protocol for developers
            </span>
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
            Build and use interactive blocks connected to the world of{" "}
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
              }}
              component="span"
            >
              structured data
              <Box
                className="data-highlight"
                sx={{
                  content: "''",
                  position: "absolute",
                  top: "100%",
                  height: 4,
                  left: 0,
                  width: "100%",
                  // background:
                  //   "linear-gradient(90deg, #6B54EF 1.95%, rgba(107, 84, 239, 0) 100%)",
                }}
              />
            </Box>
          </Typography>
          <Typography
            variant="body1"
            color={theme.palette.purple[300]}
            mb={4}
            width={{ xs: "100%", lg: "74%" }}
            textAlign={{ xs: "center", lg: "left" }}
          >
            An open standard for building and using
            <strong> data-driven blocks</strong>. Make your applications both
            human and machine-readable.
          </Typography>
          <Link href="/docs/developing-blocks">
            <Button startIcon={<BoltIcon />}>Read the Quickstart Guide</Button>
          </Link>
        </Box>
      </Container>

      <Box
        sx={{
          position: { xs: "relative", lg: "absolute" },
          zIndex: 1,
          maxWidth: 2000,
          top: 0,
          bottom: 0,
          left: "50%",
          width: "100%",
          transform: "translateX(-50%)",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", lg: "40vw" },
            position: { xs: "relative", lg: "absolute" },
            bottom: { xs: 0, lg: "10%" },
            right: 0,
            display: "flex",
            justifyContent: "center",
            zIndex: 2,
            "::after": {
              content: `""`,
              position: "absolute",
              display: { xs: "block", lg: "none" },
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
          {isMobile ? (
            <Box
              component="img"
              src="/assets/header-img-mobile.svg"
              sx={{
                boxShadow: 5,
                display: "block",
                width: "80%",
                maxWidth: 400,
              }}
            />
          ) : (
            <HeaderCard />
          )}
        </Box>
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      >
        {Array.from(Array(6), (_, index) => index + 1).map((item) => (
          <Box
            key={item}
            className="background-balls"
            sx={{
              height: 8,
              width: 8,
              backgroundColor: "#AD9EFF",
              filter: "blur(8px)",
              position: "absolute",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
        {Array.from(Array(4), (_, index) => index + 1).map((item) => (
          <Box
            key={item}
            className="background-balls"
            sx={{
              height: 60,
              width: 60,
              backgroundColor: "#E6DEF8",
              opacity: 0.3,
              filter: "blur(30px)",
              position: "absolute",
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 50}%`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};
