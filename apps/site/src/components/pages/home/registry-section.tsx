import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Container,
  // Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FunctionComponent } from "react";

import { ExpandedBlockMetadata as BlockMetadata } from "../../../lib/blocks";
import { BlocksSlider } from "../../blocks-slider";
import { BlockProtocolIcon } from "../../icons";
// import { MapboxIcon } from "../../icons/mapbox-icon";
// import { OpenAiIcon } from "../../icons/open-ai-icon";
import { Link } from "../../link";
import { LinkButton } from "../../link-button";

const BrowseBlocksSection = ({ isMobile = false }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: { xs: "center" },
      }}
    >
      <Box mb={1.5}>
        <LinkButton
          href="/hub"
          variant="secondary"
          sx={{
            background: "transparent",
          }}
          startIcon={
            <SearchIcon
              sx={{
                fontSize: 18,
              }}
            />
          }
        >
          Browse all blocks
        </LinkButton>
      </Box>

      <Box display="flex">
        <Typography
          variant="bpSmallCopy"
          sx={{
            textAlign: { xs: "center", lg: "right" },
            lineHeight: "26px",
          }}
        >
          <strong>Anyone can publish a block.</strong>{" "}
          {isMobile ? <br /> : null}If you can’t see one you want,{" "}
          <Link
            href="/docs/developing-blocks"
            sx={{
              color: ({ palette }) => `${palette.purple[700]} !important`,
            }}
          >
            build it!
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

type RegistrySectionProps = {
  catalog: BlockMetadata[];
};

export const RegistrySection: FunctionComponent<RegistrySectionProps> = ({
  catalog,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        py: { xs: 4, lg: 12 },
        px: { xs: "1rem", lg: 0 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        background:
          "radial-gradient(116.02% 95.04% at 50% 100.79%, #f5f3fa 0%, #FFFFFF 80.54%)",
        borderBottom: "1px solid #eceaf1",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: { xs: 2.5, lg: 4 },
          mb: { xs: 2.5, lg: 4 },
          maxWidth: { xs: "95%", md: "85%", lg: 1100 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="bpHeading2"
            sx={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              fontWeight: 400,
              fontStyle: "italic",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            Blocks on the
            <BlockProtocolIcon
              gradient
              sx={{
                fontSize: "0.8em",
                marginBottom: "0.1em",
                px: { xs: 1, sm: 1.25 },
              }}
            />
            <strong>Hub</strong>
          </Typography>

          {/* <Stack */}
          {/*  sx={{ */}
          {/*    flexDirection: "row", */}
          {/*    gap: 2.25, */}
          {/*    alignItems: "center", */}
          {/*    flexWrap: "wrap", */}
          {/*    justifyContent: { xs: "center", lg: "flex-start" }, */}
          {/*  }} */}
          {/* > */}
          {/*  <OpenAiIcon sx={{ width: 105 }} />  */}
          {/*  <MapboxIcon sx={{ width: 115 }} /> */}
          {/*  <Box component="img" src="/assets/logos/mono/hash.svg" /> */}

          {/*  <Typography */}
          {/*    variant="bpSmallCaps" */}
          {/*    sx={{ */}
          {/*      fontWeight: 500, */}
          {/*      color: "#9EACBA", */}
          {/*      whiteSpace: "nowrap", */}
          {/*    }} */}
          {/*  > */}
          {/*    And more */}
          {/*  </Typography> */}
          {/* </Stack> */}
        </Box>

        {isSmallScreen ? null : <BrowseBlocksSection />}
      </Container>

      <Box sx={{ width: "100%" }}>
        <BlocksSlider catalog={catalog} />
      </Box>

      {isSmallScreen ? (
        <Box mb={5}>
          <BrowseBlocksSection isMobile={isMobile} />
        </Box>
      ) : null}
    </Box>
  );
};
