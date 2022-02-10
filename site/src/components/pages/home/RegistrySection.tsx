import { VFC } from "react";
import { Typography, Box } from "@mui/material";
import { ExpandedBlockMetadata as BlockMetadata } from "../../../lib/blocks";
import { Link } from "../../Link";
import { Spacer } from "../../Spacer";
import { BlockHubIcon } from "../../icons";

import { BlocksSlider } from "../../BlocksSlider";
import { LinkButton } from "../../LinkButton";

type RegistrySectionProps = {
  catalog: BlockMetadata[];
};

export const RegistrySection: VFC<RegistrySectionProps> = ({ catalog }) => {
  return (
    <Box
      sx={{
        mb: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: {
            xs: "90%",
            md: "100%",
            mx: "auto",
            maxWidth: 850,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
        }}
      >
        <Typography variant="bpHeading2" mb={3}>
          Tap into a global registry of reusable blocks
        </Typography>
        <Typography sx={{ mb: 6, width: { xs: "100%", md: "520px" } }}>
          As a developer, building your applications using the{" "}
          <strong>Block Protocol</strong> will give you access to a global
          registry of reusable, flexible blocks to embed inside your
          application. All connected to powerful structured data formats.
        </Typography>
      </Box>
      <Box sx={{ width: "100%" }} mb={6}>
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
        <Spacer height={4} />
        <Box>
          Anyone can build new blocks and submit them to the registry. If you
          can’t see the block type you want,{" "}
          <Link href="/docs/developing-blocks">start building it today.</Link>
        </Box>
      </Box>
    </Box>
  );
};
