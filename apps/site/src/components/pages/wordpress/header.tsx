import { Box, Container, Typography, useTheme } from "@mui/material";

import { BpWpIcons } from "./bp-wp-icons";
import { CustomButton } from "./custom-button";

export const Header = () => {
  const theme = useTheme();

  const onInstallWordPress = () => {
    // TODO
  };

  const onDownload = () => {
    // TODO
  };

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
          sx={{
            marginTop: 6.25,
            display: "flex",
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <CustomButton
            onClick={onInstallWordPress}
            buttonLabel="Install on WordPress.com"
            sx={{
              mb: { xs: 1, md: 0 },
              mr: { xs: 0, md: 2.25 },
              minWidth: 300,
            }}
          />
          <CustomButton
            onClick={onDownload}
            backgroundColor="#FFFFFF"
            color="#3A2084"
            sx={{
              border: "1px solid #3A2084",
              mb: { xs: 1, md: 0 },
              mr: { xs: 0, md: 5.25 },
              minWidth: 300,
            }}
            buttonLabel="Download for WordPress.org"
          />
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
