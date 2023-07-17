import { Box, Container, Typography, useTheme } from "@mui/material";

import { BpWpIcons } from "./bp-wp-icons";
import { CustomButton } from "./custom-button";

export const Header = () => {
  const theme = useTheme();

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
          mt: { xs: 7, md: 9.75 },
          width: { xs: "95%" },
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
            mb: 2.25,
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
          marginTop={6.25}
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
            <CustomButton
              onClick={() => {
                window.open("https://wordpress.com/plugins/blockprotocol/");
              }}
              sx={{
                fontSize: 15,
                color: theme.palette.bpGray[20],
                background: theme.palette.purple[700],
              }}
              variant="primary"
            >
              Install on WordPress.com
            </CustomButton>
            <CustomButton
              onClick={() => {
                window.open("https://wordpress.org/plugins/blockprotocol/");
              }}
              sx={{
                fontSize: 15,
                color: "#3A2084",
                background: "transparent",
              }}
              variant="secondary"
            >
              Download for WordPress.org
            </CustomButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "start" },
            }}
          >
            <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>
              <strong>COMPATIBLE WITH</strong>
            </Typography>
            <Typography sx={{ fontWeight: 400, fontSize: "14px" }}>
              Gutenberg, Elementor, Brizy, Divi
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
