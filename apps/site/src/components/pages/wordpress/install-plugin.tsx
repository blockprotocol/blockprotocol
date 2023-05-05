import { Box, Grid, Link, Typography } from "@mui/material";

import { FadeInOnViewport } from "../../fade-in-on-viewport";
import {
  ArrowUpRightIcon,
  DiscordIcon,
  DownloadIcon,
  InfoCircleIcon,
  ServerIcon,
  WordPressIcon,
} from "../../icons";
import { CustomButton } from "./custom-button";
import { IconSection } from "./icon-section";

export const InstallPlugin = () => {
  return (
    <Box
      sx={{
        fontFamily: "Inter",
        position: "relative",
        zIndex: 1,
        pb: 15,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "60%",
          maxWidth: 660,
          height: 75,
          top: "-11rem",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#0500FF",
          opacity: 0.5,
          filter: "blur(100px)",
        }}
      />

      <Box
        sx={{
          margin: "auto",
          width: "calc(100% - 2rem)",
          position: "absolute",
          bottom: "100%",
          left: "1rem",
          zIndex: 1,
        }}
      >
        <Box
          sx={({ breakpoints }) => ({
            background:
              "linear-gradient(181.4deg, rgba(255, 255, 255, 0.65) 50%, #FDFCFE 94.38%)",
            border: "2px solid white",
            borderBottomWidth: "1px",
            borderBottomColor: "transparent",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            maxWidth: "1200px",
            margin: "auto",
            pb: { xs: 2, md: 4.5 },
            pt: { xs: 2, md: 5.3 },
            pl: { xs: "15px", lg: "77px" },
            pr: { xs: "16px", lg: "83px" },
            [breakpoints.down("lg")]: {
              textAlign: "center",
            },
          })}
        >
          <FadeInOnViewport>
            <Typography
              variant="bpSmallCopy"
              sx={{
                fontSize: "1rem",
                lineHeight: 1,
                fontWeight: 500,
                mb: 1,
                color: "#0059A5",
              }}
            >
              <strong>INSTALL THE PLUGIN</strong>
            </Typography>
            <Typography
              variant="bpLargeText"
              sx={{
                fontSize: "2.6rem",
                lineHeight: 1,
                fontWeight: 700,
                mb: 1,
                fontStyle: "italic",
              }}
              component="div"
            >
              Get started with the{" "}
              <Typography
                variant="bpLargeText"
                sx={{
                  background:
                    "linear-gradient(89.74deg, #7259FD 10.57%, #0085FF 95.46%)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  fontSize: "2.6rem",
                  fontStyle: "italic",
                  lineHeight: 1,
                  fontWeight: 700,
                  pr: "0.3rem",
                  mb: 1,
                }}
                display="inline"
              >
                Block Protocol
              </Typography>
            </Typography>
          </FadeInOnViewport>
        </Box>
      </Box>

      <Box
        sx={{
          width: "calc(100% - 2rem)",
          maxWidth: "1200px",
          background:
            "linear-gradient(181.4deg, rgba(255, 255, 255, 0.65) 50%, #FDFCFE 94.38%)",
          border: "2px solid white",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
          boxShadow:
            "0px 2.8px 2.2px rgba(166, 142, 187, 0.15), 0px 6.7px 5.3px rgba(166, 142, 187, 0.08), 0px 12.5px 10px rgba(166, 142, 187, 0.05), 0px 22.3px 17.9px rgba(166, 142, 187, 0.09), 0px 41.8px 33.4px rgba(166, 142, 187, 0.1), 0px 100px 80px rgba(166, 142, 187, 0.1)",
          pt: { xs: 3, lg: 8.25 },
          pl: { xs: "15px", lg: "77px" },
          pr: { xs: "16px", lg: "83px" },
          pb: { xs: 2.5, lg: 3 },
          position: "relative",
          zIndex: 1,
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Grid
          container
          sx={({ breakpoints }) => ({
            width: "100% !important",
            pt: 0,
            pb: 9,
            margin: "1rem",
            [breakpoints.down("lg")]: {
              maxWidth: 500,
            },
          })}
          rowSpacing={{ xs: 3, lg: 5.5 }}
          columnSpacing={{ xs: 0, lg: 5.5 }}
        >
          <IconSection
            xs={12}
            lg={6}
            maxWidth={380}
            color="#3373BE"
            icon={
              <WordPressIcon
                sx={{
                  fontSize: 32,
                  mb: 1.5,
                  color: "#3373BE",
                }}
              />
            }
            title="WordPress.com"
            description="Install the plugin with just one click and follow the prompts to get started"
            action={
              <CustomButton
                variant="primary"
                size="medium"
                sx={{
                  backgroundColor: "#3373BE",
                  fontSize: "14px",
                  width: "250px",
                  alignContent: "start",
                }}
                endIcon={<ArrowUpRightIcon />}
              >
                Install on WordPress.com
              </CustomButton>
            }
          />

          <IconSection
            xs={12}
            lg={6}
            maxWidth={380}
            color="#3373BE"
            icon={<ServerIcon sx={{ fontSize: 32, mb: 1.5 }} />}
            title="self-hosted WordPress"
            description={
              <span>
                Download the plugin and upload the ZIP directly to your website
                via the plugins admin panel
              </span>
            }
            action={
              <CustomButton
                variant="primary"
                size="medium"
                sx={{
                  backgroundColor: "#2C81E4",
                  fontSize: "14px",
                  width: "230px",
                  alignContent: "start",
                }}
                endIcon={<DownloadIcon />}
              >
                Download plugin ZIP
              </CustomButton>
            }
          />
        </Grid>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            alignSelf: "start",
          }}
        >
          <Box
            sx={{
              fontWeight: 400,
              lineHeight: 1.2,
              my: 1,
            }}
          >
            <InfoCircleIcon sx={{ mr: 2, fill: "#48B3F4", color: "#48B3F4" }} />{" "}
            Once you’ve installed the plugin,{" "}
            <Link href="">get a free API key</Link> to connect your website to
            the Block Protocol
          </Box>
          <Box
            sx={{
              fontWeight: 400,
              lineHeight: 1.2,
              mb: 1,
              mt: 1,
            }}
          >
            <DiscordIcon
              sx={{ color: ({ palette }) => palette.purple[50], mr: 2 }}
            />{" "}
            If you get stuck, feel free to reach out on our{" "}
            <Link href="/">community Discord server</Link> or drop us a{" "}
            <Link href="/">message directly</Link>.
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
