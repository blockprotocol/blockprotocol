import { Box, Container, Typography } from "@mui/material";
import { FunctionComponent } from "react";

export const Header: FunctionComponent = () => {
  return (
    <Container
      sx={{
        position: "relative",
        zIndex: 3,
        pt: {
          xs: "128px",
          md: "160px",
        },
        mb: { xs: 6, md: 10 },
        maxWidth: { xs: "95%", md: "75%", lg: "60%" },
      }}
    >
      <Typography
        variant="bpHeading1"
        sx={{
          lineHeight: 1,
          color: ({ palette }) => palette.gray[90],
          mb: 2.5,
          fontSize: "clamp(3rem, 5vw, 7rem)",
          fontStyle: "italic",
          letterSpacing: "-0.02em",
        }}
      >
        Pricing
      </Typography>
      <Typography
        variant="bpBodyCopy"
        sx={{
          color: ({ palette }) => palette.gray[90],
          fontSize: { xs: "1.5rem", md: "2rem" },
          lineHeight: 1.4,
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
        is a free and open internet standard
      </Typography>
    </Container>
  );
};