import SearchIcon from "@mui/icons-material/Search";
import { Box, Container, Stack, Typography } from "@mui/material";
import { FunctionComponent } from "react";

import { ExpandedBlockMetadata as BlockMetadata } from "../../../lib/blocks";
import { BlocksSlider } from "../../blocks-slider";
import { BlockProtocolIcon, HubIcon } from "../../icons";
import { Link } from "../../link";
import { LinkButton } from "../../link-button";

type RegistrySectionProps = {
  catalog: BlockMetadata[];
};

export const RegistrySection: FunctionComponent<RegistrySectionProps> = ({
  catalog,
}) => {
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
          maxWidth: { xs: "95%", md: "85%", lg: 1000 },
        }}
      >
        <Box
          sx={{
            mx: "auto",
            width: { xs: "100%", md: "100%" },
            maxWidth: { xs: "100%", md: "1100px" },
            display: "flex",
            flexDirection: "column",
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
              mb: 2,
            }}
          >
            Blocks on the
            <BlockProtocolIcon
              gradient
              sx={{ fontSize: "0.8em", marginBottom: "0.1em", px: 1.25 }}
            />
            <strong>Hub</strong>
          </Typography>

          <Stack flexDirection="row" gap={2.25} alignItems="center">
            <Box component="img" src="/assets/new-home/open-ai-logo.svg" />
            <Box component="img" src="/assets/new-home/mapbox-logo.svg" />
            <Box component="img" src="/assets/new-home/hash-logo.svg" />

            <Typography
              variant="bpSmallCaps"
              sx={{
                fontWeight: 500,
                color: ({ palette }) => palette.gray[50],
              }}
            >
              And more
            </Typography>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: { xs: "center", lg: "flex-end" },
          }}
        >
          <Box>
            <LinkButton
              href="/hub"
              variant="secondary"
              sx={{
                color: ({ palette }) => palette.purple[70],
                background: "transparent",
                mb: 1.5,
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
                fontSize: "1rem",
                textAlign: "right",
              }}
            >
              <strong>Anyone can publish a block.</strong> If you can’t see one
              you want,{" "}
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
      </Container>

      <Box sx={{ width: "100%" }} mb={4}>
        <BlocksSlider catalog={catalog} />
      </Box>
    </Box>
  );
};
