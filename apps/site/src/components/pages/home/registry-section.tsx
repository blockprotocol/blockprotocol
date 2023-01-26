import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Container,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FunctionComponent } from "react";

import { ExpandedBlockMetadata as BlockMetadata } from "../../../lib/blocks";
import { BlocksSlider } from "../../blocks-slider";
import { BlockProtocolIcon } from "../../icons";
import { Link } from "../../link";
import { LinkButton } from "../../link-button";

const BrowseBlocksSection = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: { xs: "center", lg: "flex-end" },
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
          <strong>Anyone can publish a block.</strong> If you can’t see one you
          want,{" "}
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
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

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
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "space-between",
          gap: { xs: 2.5, lg: 10 },
          mb: { xs: 2.5, lg: 10 },
          maxWidth: { xs: "95%", md: "85%", lg: 1100 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: { xs: "center", lg: "flex-start" },
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
              mb: 2.25,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Blocks on the
            <BlockProtocolIcon
              gradient
              sx={{ fontSize: "0.8em", marginBottom: "0.1em", px: 1.25 }}
            />
            <strong>Hub</strong>
          </Typography>

          <Stack
            sx={{
              flexDirection: "row",
              gap: 2.25,
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: { xs: "center", lg: "flex-start" },
            }}
          >
            <Box component="img" src="/assets/logos/mono/openai.svg" />
            <Box component="img" src="/assets/logos/mono/mapbox.svg" />
            <Box component="img" src="/assets/logos/mono/hash.svg" />

            <Typography
              variant="bpSmallCaps"
              sx={{
                fontWeight: 500,
                color: "#9EACBA",
                whiteSpace: "nowrap",
              }}
            >
              And more
            </Typography>
          </Stack>
        </Box>

        {isMobile ? null : <BrowseBlocksSection />}
      </Container>

      <Box sx={{ width: "100%" }}>
        <BlocksSlider catalog={catalog} />
      </Box>

      {isMobile ? (
        <Box mb={5}>
          <BrowseBlocksSection />
        </Box>
      ) : null}
    </Box>
  );
};
