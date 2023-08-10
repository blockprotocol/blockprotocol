import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Box, Container, Typography, useTheme } from "@mui/material";

import { FontAwesomeIcon } from "../../icons";
import { LinkButton } from "../../link-button";
import { BpWpIcons } from "./bp-wp-icons";

export const Header = () => {
  const theme = useTheme();

  return (
    <Container
      sx={{
        position: "relative",
        zIndex: 3,
        mt: { xs: 7, md: 10 },
        pb: { xs: 7, md: 13.375 },
        width: { xs: "95%", md: "75%", lg: "80%" },
        display: "flex",
        flexDirection: "column",
        alignItems: { sm: "center", md: "start" },
      }}
    >
      <Box
        sx={({ breakpoints }) => ({
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          mb: 1,
          [breakpoints.down("md")]: {
            flexDirection: "column",
            alignSelf: "center",
          },
          fontSize: "clamp(3rem, 5vw, 5rem)",
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
          sx={{
            lineHeight: 1,
            color: ({ palette }) => palette.gray[90],
            fontSize: "0.8em",
            textAlign: { xs: "center", md: "left" },
          }}
        >
          Block Protocol for WordPress
        </Typography>
      </Box>

      <Typography
        variant="bpBodyCopy"
        lineHeight={1.4}
        color={theme.palette.gray[80]}
        sx={{
          fontSize: { xs: "1.25rem", md: "1.45rem" },
          textAlign: { xs: "center", md: "left" },
        }}
      >
        Upgrade your WordPress site with new superpowers
      </Typography>

      <Box
        display="flex"
        marginTop={4}
        flexDirection={{ xs: "column", md: "row" }}
        gap={5}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <LinkButton
            variant="primary"
            href="https://wordpress.com/plugins/blockprotocol/"
            sx={{
              fontSize: 15,
              color: theme.palette.bpGray[20],
              background: theme.palette.purple[700],
            }}
          >
            Install on WordPress.com
          </LinkButton>
          <LinkButton
            variant="secondary"
            href="https://wordpress.org/plugins/blockprotocol/"
            sx={{
              fontSize: 15,
              color: "#3A2084",
              background: "transparent",
            }}
            endIcon={<FontAwesomeIcon icon={faArrowRight} />}
          >
            Download for WordPress.org
          </LinkButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "start" },
            alignSelf: "center",
          }}
        >
          <Typography
            variant="bpHeading6"
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              color: ({ palette }) => palette.black,
              letterSpacing: "0.05em",
              lineHeight: 1.3,
            }}
          >
            COMPATIBLE WITH
          </Typography>
          <Typography sx={{ fontWeight: 400, fontSize: "14px" }}>
            Gutenberg, Elementor, Brizy, Divi
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};
