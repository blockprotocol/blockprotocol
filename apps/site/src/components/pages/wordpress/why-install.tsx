import { Box, Container, Grid, Typography } from "@mui/material";

import {
  BinaryIcon,
  BlockProtocolIcon,
  GlobeIcon,
  LayerPlusIcon,
  RocketIcon,
} from "../../icons";
import { EarlyAccessCTA } from "./early-access-cta";
import { IconSection } from "./icon-section";

export const WhyInstall = () => {
  return (
    <Box
      sx={{
        background:
          "radial-gradient(116.02% 95.04% at 50% 100.79%, #F3F0F9 0%, #FFFFFF 70.54%)",
        pb: "11rem",
        borderBottom: `1px solid #edeaf1`,
        position: "relative",
      }}
    >
      <Container
        sx={{
          mb: 10,
          width: { xs: "95%", md: "75%", lg: "60%" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "Inter",
        }}
      >
        <Typography
          sx={({ breakpoints }) => ({
            fontSize: "2rem",
            lineHeight: 1,
            fontWeight: 900,
            mb: 1,
            width: 1,
            textAlign: "center",
            [breakpoints.down("sm")]: {
              textAlign: "left",
            },
          })}
        >
          Why install the Block Protocol plugin?
        </Typography>
        <Typography
          sx={({ breakpoints }) => ({
            fontSize: "2rem",
            lineHeight: 1,
            color: ({ palette }) => palette.purple[70],
            width: 1,
            textAlign: "center",
            [breakpoints.down("sm")]: {
              textAlign: "left",
            },
          })}
        >
          Do more with a supercharged WordPress...
        </Typography>

        <Grid
          container
          sx={({ breakpoints }) => ({
            pt: 7.25,
            [breakpoints.down("lg")]: {
              pt: 2,
              maxWidth: 500,
              margin: "auto",
            },
          })}
          columnSpacing={{ xs: 0, lg: 10 }}
          rowSpacing={{ xs: 3, lg: 6.875 }}
        >
          <IconSection
            xs={12}
            lg={6}
            color="#A700A0"
            icon={<GlobeIcon sx={{ fontSize: 32 }} />}
            title="Access an open, growing ecosystem of high-quality blocks"
            description={
              <>
                Expand the number of blocks available for use within WordPress
                and gain access to new capabilities. New <strong>Þ</strong>{" "}
                blocks appear automatically in WordPress
              </>
            }
          />

          <IconSection
            xs={12}
            lg={6}
            color="#810A7C"
            icon={<BinaryIcon sx={{ fontSize: 32 }} />}
            title="Structured data made easier than unstructured"
            grayTitle=" ...a benefit not a chore"
            description="Quickly capture information in a typed fashion, and import structured data such as maps, weather, flight info, product reviews, and media details into your own WordPress database"
          />

          <IconSection
            xs={12}
            lg={6}
            color="#CC3AC6"
            icon={<LayerPlusIcon sx={{ fontSize: 32 }} />}
            title="Find new blocks at the point of need"
            description={
              <>
                Discover and use new blocks when you actually need them,
                directly from within the WordPress editor, and avoid needing to
                install block plugins ever again. A one-time install of the{" "}
                <strong>Þ</strong> plugin provides instant access to new and
                updated blocks as soon as they&#8217;re published
              </>
            }
          />

          <IconSection
            xs={12}
            lg={6}
            color="#CF51CA"
            icon={<RocketIcon sx={{ fontSize: 32 }} />}
            title="More powerful blocks"
            grayTitle=" including OpenAI-powered blocks"
            description={
              <>
                Directly access powerful third-party tools such as those from
                Mapbox and OpenAI without needing to sign up for your own
                account with dozens of different services or install any
                additional WordPress plugins&#65293;the <strong>Þ</strong>{" "}
                abstracts away the need to interface with different providers
              </>
            }
          />
        </Grid>

        <Typography
          sx={{
            fontSize: "1.75rem",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            mt: 13.75,
            fontWeight: 900,
            textAlign: "center",
          }}
        >
          Get{" "}
          <span
            style={{
              background: "linear-gradient(180deg, #293BDF 0%, #53A5F1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            early access
          </span>{" "}
          to the <BlockProtocolIcon gradient sx={{ mb: 0.5 }} /> WordPress
          Plugin
        </Typography>

        <Box sx={{ maxWidth: 500, width: 1, mt: 5 }}>
          <EarlyAccessCTA />
        </Box>
      </Container>
    </Box>
  );
};
