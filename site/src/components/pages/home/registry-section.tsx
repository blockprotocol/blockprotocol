import { Box, Typography } from "@mui/material";
import { VFC } from "react";

import { ExpandedBlockMetadata as BlockMetadata } from "../../../lib/blocks";
import { BlocksSlider } from "../../blocks-slider";
import { BlockHubIcon } from "../../icons";
import { Link } from "../../link";
import { LinkButton } from "../../link-button";
import { Spacer } from "../../spacer";

type RegistrySectionProps = {
  catalog: BlockMetadata[];
};

export const RegistrySection: VFC<RegistrySectionProps> = ({ catalog }) => {
  return (
    <Box
      sx={{
        my: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          mx: "auto",
          width: { xs: "100%", md: "1100px" },
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
          to embed inside your application.
        </Typography>
      </Box>
      <Box sx={{ width: "100%" }} mb={4}>
        <BlocksSlider catalog={catalog} />
      </Box>
      <Box sx={{ textAlign: "center", width: { md: "40%" }, maxWidth: 540 }}>
        <LinkButton
          href="/hub"
          variant="secondary"
          startIcon={<BlockHubIcon />}
        >
          Explore all Blocks
        </LinkButton>
        <Spacer height={3} />
        <Box>
          <Typography
            sx={{
              width: { xs: "100%", md: "50ch" },
              color: ({ palette }) => palette.gray[80],
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
