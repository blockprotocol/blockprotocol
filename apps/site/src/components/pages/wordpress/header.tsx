import { Box, Container, Typography, useTheme } from "@mui/material";
import Image from "next/legacy/image";
import wpHelixImage from "../../../../public/assets/new-home/wp-helix.png";
import { BpWpIcons } from "./bp-wp-icons";
import { EarlyAccessCTA } from "./early-access-cta";

export const Header = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pb: { xs: 20, md: 28 },
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            textTransform: "uppercase",
            color: ({ palette }) => palette.purple[700],
            mb: 2.25,
            fontWeight: 500,
            letterSpacing: "0.06rem",
            mx: "auto",
          }}
          textAlign="center"
          variant="bpSmallCaps"
        >
          EARLY ACCESS
        </Typography>

        <Box
          sx={({ breakpoints }) => ({
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            mb: 2.25,
            [breakpoints.down("md")]: {
              flexDirection: "column",
            },
            fontSize: "clamp(3rem, 5vw, 7rem)",
          })}
        >
          <Box
            sx={({ breakpoints }) => ({
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              mr: 2.25,
              mb: 1,
              [breakpoints.down("md")]: {
                mr: 0,
              },
            })}
          >
            <BpWpIcons />
          </Box>

          <Typography
            variant="bpHeading1"
            textAlign="center"
            sx={{
              lineHeight: 1,
              color: ({ palette }) => palette.gray[90],
              fontSize: "1em",
            }}
          >
            WordPress Plugin
          </Typography>
        </Box>

        <Typography
          variant="bpBodyCopy"
          lineHeight={1.4}
          color={theme.palette.gray[80]}
          textAlign="center"
          sx={{
            margin: "0 auto",
            fontSize: { xs: "1.25rem", md: "1.45rem" },
          }}
        >
          Block Protocol blocks work across all Þ supporting applications
        </Typography>
        <Typography
          variant="bpBodyCopy"
          lineHeight={1.4}
          color={theme.palette.gray[80]}
          textAlign="center"
          sx={{
            margin: "0 auto",
            fontWeight: 700,
            fontSize: { xs: "1.25rem", md: "1.45rem" },
          }}
        >
          ...now including WordPress, powering 43% of the web
        </Typography>

        <Box
          sx={{
            marginTop: 6.25,
            maxWidth: 500,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <EarlyAccessCTA />
        </Box>
      </Container>

      <Image layout="responsive" src={wpHelixImage} />
    </Box>
  );
};
