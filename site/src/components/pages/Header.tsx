import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { Button } from "../Button";

export const Header = () => {
  return (
    <Box
      sx={{
        background:
          "radial-gradient(113.45% 113.45% at 50% -13.45%, #3F4656 0.52%, #1C1C29 100%)",
        minHeight: "90vh",
        position: "relative",
      }}
    >
      <Container sx={{ pt: "20vh" }}>
        <Box sx={{ width: 660 }}>
          <Typography
            sx={{ textTransform: "uppercase", color: "purple.500", mb: 4 }}
            variant="bpSmallCaps"
          >
            A powerful new protocol for developers
          </Typography>
          <Box
            sx={{
              typography: "bpHeading1",
              lineHeight: 1,
              color: "white",
              mb: 4,
            }}
          >
            Build interactive blocks connected to the world of{" "}
            <Box
              sx={{
                position: "relative",
                ":after": {
                  content: "''",
                  position: "absolute",
                  top: "100%",
                  height: 4,
                  left: 0,
                  width: 425,
                  background:
                    "linear-gradient(90deg, #6B54EF 1.95%, rgba(107, 84, 239, 0) 100%)",
                },
              }}
            >
              structured data
            </Box>
          </Box>
          <Typography variant="body1" color="purple.300" mb={4}>
            An open standard for building
            <strong>{" "} blocks connected to structured data {" "}</strong>
            with <strong>schemas</strong>. Make your applications both human and
            machine-readable.
          </Typography>
          <Button>Read the Quickstart Guide</Button>
        </Box>
      </Container>

      <Box
        sx={{
          height: 320,
          position: "absolute",
          bottom: "15%",
          right: 0,
          transform: "translateX(10%)",
        }}
        component="img"
        src="/assets/header-image.png"
      />
    </Box>
  );
};
