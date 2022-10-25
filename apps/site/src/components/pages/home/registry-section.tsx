import { Box, Typography } from "@mui/material";
import { FunctionComponent } from "react";

import { ExpandedBlockMetadata as BlockMetadata } from "../../../lib/blocks.js";
import { BlocksSlider } from "../../blocks-slider.jsx";
import { HubIcon } from "../../icons/index.js";
import { Link } from "../../link.jsx";
import { LinkButton } from "../../link-button.jsx";

type RegistrySectionProps = {
  catalog: BlockMetadata[];
};

export const RegistrySection: FunctionComponent<RegistrySectionProps> = ({
  catalog,
}) => {
  return (
    <Box
      sx={{
        py: 12,
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
      <Box
        sx={{
          mx: "auto",
          width: { xs: "100%", md: "100%" },
          maxWidth: { xs: "100%", md: "1100px" },
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", md: "flex-start" },
        }}
      >
        <Typography
          variant="bpHeading2"
          textAlign="left"
          sx={{ width: { xs: "100%", md: "30ch" } }}
        >
          Tap into a global registry of interoperable blocks
        </Typography>
        <Box
          sx={{
            width: "120px",
            height: "2px",
            my: 3,
            background:
              "linear-gradient(to right, rgb(149, 135, 239, 1), rgba(172, 159, 255, 0))",
          }}
        />
        <Typography
          textAlign="left"
          sx={{
            mb: 6,
            width: { xs: "100%", md: "50ch" },
            lineHeight: 1.5,
            color: ({ palette }) => palette.gray[80],
          }}
        >
          As a developer, building your applications using the Block Protocol
          will give you access to a global registry of reusable, flexible blocks
          to embed.
        </Typography>
      </Box>
      <Box sx={{ width: "100%" }} mb={4}>
        <BlocksSlider catalog={catalog} />
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <LinkButton href="/hub" variant="secondary" startIcon={<HubIcon />}>
          Explore all Blocks
        </LinkButton>
        <Box>
          <Typography
            sx={{
              width: { xs: "100%", md: "50ch" },
              color: ({ palette }) => palette.gray[80],
              mt: 3,
            }}
          >
            Anyone can build new blocks and submit them to the registry. If you
            can’t see the block type you want,{" "}
            <Link href="/docs/developing-blocks">start building it today.</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
