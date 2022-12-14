import { Box, Container, Grid, Typography, useTheme } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";
import { BlockProtocolIcon } from "../../icons";
import { BinaryIcon } from "../../icons/binary-icon";
import { GlobeIcon } from "../../icons/globe-icon";
import { LayerPlusIcon } from "../../icons/layer-plus-icon";
import { RocketIcon } from "../../icons/rocket-icon";
import { EarlyAccessCTA } from "./early-access-cta";

interface SectionProps {
  color: string;
  icon: ReactNode;
  title: ReactNode;
  grayTitle?: ReactNode;
  description: ReactNode;
}

const Section: FunctionComponent<SectionProps> = ({
  color,
  icon,
  title,
  grayTitle,
  description,
}) => {
  const theme = useTheme();

  return (
    <Grid
      item
      xs={12}
      lg={6}
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "500px !important",
          color,
        }}
      >
        <Box sx={{ mb: 1.5 }}>{icon}</Box>
        <Typography
          sx={{ color, mb: 1 }}
          variant="bpLargeText"
          fontWeight={700}
        >
          {title}
          {grayTitle ? (
            <span style={{ color: theme.palette.gray[50] }}>{grayTitle}</span>
          ) : null}
        </Typography>
        <Typography
          variant="bpSmallCopy"
          sx={{ fontWeight: 400, lineHeight: 1.2 }}
        >
          {description}
        </Typography>
      </Box>
    </Grid>
  );
};

export const WhyInstall = () => {
  return (
    <Box
      sx={{
        background:
          "radial-gradient(116.02% 95.04% at 50% 100.79%, #F3F0F9 0%, #FFFFFF 70.54%)",
        pb: { xs: 20, md: 28 },
        borderBottom: `1px solid #edeaf1`,
        position: "relative",
      }}
    >
      <Container
        sx={{
          mb: { xs: 6, md: 10 },
          maxWidth: { xs: "95%", md: "75%", lg: "60%" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "Inter",
        }}
      >
        <Typography
          variant="bpHeading3"
          fontWeight={900}
          sx={{ fontFamily: "inherit", textAlign: "center" }}
        >
          Why install the Block Protocol plugin?
        </Typography>
        <Typography
          variant="bpHeading3"
          sx={{
            color: ({ palette }) => palette.purple[70],
            fontFamily: "inherit",
            textAlign: "center",
          }}
        >
          Do more with a supercharged WordPress...
        </Typography>

        <Grid
          container
          sx={{ pt: 7.25 }}
          columnSpacing={10}
          rowSpacing={{ xs: 3, lg: 6.875 }}
        >
          <Section
            color="#A700A0"
            icon={<GlobeIcon />}
            title="Access an open, growing ecosystem of high-quality blocks"
            description={
              <>
                Expand the number of blocks available for use within WordPress
                and gain access to new capabilities. New <strong>Þ</strong>{" "}
                blocks appear automatically in WordPress
              </>
            }
          />

          <Section
            color="#CC3AC6"
            icon={<LayerPlusIcon />}
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

          <Section
            color="#810A7C"
            icon={<BinaryIcon />}
            title="Structured data made easier than unstructured"
            grayTitle=" ...a benefit not a chore"
            description="Quickly capture information in a typed fashion, and import structured data such as maps, weather, flight info, product reviews, and media details into your own WordPress database"
          />

          <Section
            color="#CF51CA"
            icon={<RocketIcon />}
            title="More powerful blocks"
            grayTitle=" including OpenAI-powered blocks"
            description={
              <>
                Directly access powerful third-party tool such as those from
                Mapbox and OpenAI without needing to sign up for your own
                account with dozens of different services or install any
                additional WordPress plugins&#65293;the <strong>Þ</strong>{" "}
                abstracts away the need to interface with different providers
              </>
            }
          />
        </Grid>

        <Typography
          variant="bpHeading3"
          sx={{
            fontFamily: "inherit",
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
              marginLeft: 8,
              marginRight: 8,
            }}
          >
            early access
          </span>{" "}
          to the <BlockProtocolIcon gradient sx={{ marginX: 1, mb: 0.5 }} />{" "}
          WordPress Plugin
        </Typography>

        <Box sx={{ maxWidth: 450, mt: 5 }}>
          <EarlyAccessCTA />
        </Box>
      </Container>
    </Box>
  );
};
