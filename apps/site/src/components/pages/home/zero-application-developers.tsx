import { Box, Container, Typography, useTheme } from "@mui/material";

import { SolidSparklesIcon } from "../../icons/solid-sparkles-icon";
import { LinkButton } from "../../link-button";

export const ZeroApplicationDevelopers = () => {
  const theme = useTheme();

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        zIndex: 3,
        mb: { xs: 6, md: 10 },
        maxWidth: { xs: "95%", md: "75%", lg: "60%" },
      }}
    >
      <Box
        component="img"
        src="/assets/new-home/faded-zero.svg"
        sx={{
          position: "relative",
          top: 28,
        }}
      />

      <Typography
        sx={{
          textTransform: "uppercase",
          color: ({ palette }) => palette.purple[800],
          mb: 0.75,
          fontWeight: 700,
          fontSize: "1.125rem",
          mx: "auto",
          letterSpacing: 0,
        }}
        textAlign="center"
        variant="bpSmallCaps"
      >
        Application developers
      </Typography>

      <Typography
        variant="bpHeading2"
        textAlign="left"
        sx={{
          textAlign: "center",
          fontWeight: 400,
          fontStyle: "italic",
          mb: 2,
          letterSpacing: "-0.02em",
        }}
      >
        Add new blocks to your app with
        <br />
        <strong>
          <Box
            component="span"
            sx={{ color: ({ palette }) => palette.purple[70] }}
          >
            zero
          </Box>{" "}
          marginal implementation cost
        </strong>
      </Typography>

      <Box
        sx={{
          width: 166,
          height: 3,
          background: "linear-gradient(89.98deg, #6B54EF 0%, #FFFFFF 100%)",
          borderRadius: 25,
          mb: 3.5,
        }}
      />

      <Typography variant="bpBodyCopy" sx={{ textAlign: "center", mb: 2 }}>
        <strong>
          Give your users access to an ever-growing library of high-quality
          blocks.
        </strong>
        <br />
        Once the{" "}
        <Box
          component="span"
          sx={{ fontWeight: 700, color: ({ palette }) => palette.purple[70] }}
        >
          Þ
        </Box>{" "}
        is supported, blocks work out the box, and your users get access to
        powerful blocks that enable them to do more within your application.
      </Typography>

      <LinkButton
        href="/docs/embedding-blocks"
        variant="primary"
        sx={{ color: theme.palette.common.white, whiteSpace: "nowrap" }}
        startIcon={
          <SolidSparklesIcon
            sx={{
              fontSize: 18,
            }}
          />
        }
      >
        Learn more about embedding{" "}
        <Box component="strong" sx={{ mx: 0.5 }}>
          Þ
        </Box>{" "}
        blocks
      </LinkButton>
    </Container>
  );
};
