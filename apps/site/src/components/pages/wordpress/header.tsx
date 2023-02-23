import { Stream } from "@cloudflare/stream-react";
import { Box, Container, Skeleton, Typography, useTheme } from "@mui/material";
import Image from "next/legacy/image";
import { useState } from "react";

import wpHelixImage from "../../../../public/assets/new-home/wp-helix.png";
import { BpWpIcons } from "./bp-wp-icons";
import { EarlyAccessCTA } from "./early-access-cta";

export const Header = () => {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);

  return (
    <Box
      sx={{
        pb: { xs: 11.5, md: 16 },
        position: "relative",
      }}
    >
      <Container
        sx={{
          position: "relative",
          zIndex: 3,
          pt: { xs: 7, md: 8.75 },
          mb: { xs: 4, md: 6.25 },
          width: { xs: "95%", md: "75%", lg: "60%" },
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
          Early access
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
              [breakpoints.down("md")]: {
                mr: 0,
                mb: 1,
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
              whiteSpace: "nowrap",
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
          Block Protocol blocks work across all Þ supporting applications{" "}
          <Box
            component="strong"
            sx={({ breakpoints }) => ({
              display: "block",
              [breakpoints.down("lg")]: {
                display: "inline",
              },
            })}
          >
            ...now including WordPress, powering 43% of the web
          </Box>
        </Typography>

        <Box
          sx={{
            marginTop: 6.25,
            maxWidth: 500,
            width: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <EarlyAccessCTA />
        </Box>
      </Container>

      <Box sx={{ width: "100%", position: "relative" }}>
        <Box
          sx={{
            width: 1,
            position: "absolute !important",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
          }}
        >
          <Image layout="responsive" src={wpHelixImage} />
        </Box>
        <Box
          sx={{
            width: { xs: "95%", md: "75%", lg: "60%" },
            maxWidth: 1200,
            div: {
              width: "100%",
              height: "100%",
              display: loading ? "none" : "block",
            },
            aspectRatio: "16/9",
            margin: "auto",
          }}
        >
          {loading ? (
            <Skeleton
              sx={{
                width: "100%",
                height: "100%",
                transform: "unset",
              }}
            />
          ) : null}
          <Stream
            controls
            src="17a35fcc1fb28ce771c1d3917cd51c21"
            onCanPlay={() => setLoading(false)}
            primaryColor="#7963F5"
            letterboxColor="transparent"
          />
        </Box>
      </Box>
    </Box>
  );
};
