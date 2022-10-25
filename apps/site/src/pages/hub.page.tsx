import { Box, Container, Grid, Typography } from "@mui/material";
import { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";

import { BlockCard, BlockCardComingSoon } from "../components/block-card.js";
import { getAllBlocks } from "../lib/api/blocks/get.js";
import {
  excludeHiddenBlocks,
  ExpandedBlockMetadata as BlockMetadata,
} from "../lib/blocks.js";

interface PageProps {
  catalog: BlockMetadata[];
}

/**
 * used to create an index of all available blocks, the catalog
 */
export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const blocks = await getAllBlocks();

  return {
    props: { catalog: excludeHiddenBlocks(blocks) },
  };
};

const HubPage: NextPage<PageProps> = ({ catalog }) => {
  return (
    <>
      <NextSeo
        title="Block Protocol – Hub"
        description="The Block Protocol's registry of open-source blocks and types"
      />
      <Box
        sx={{
          mb: 20,
          position: "relative",
          backgroundImage: "url(/assets/hub-gradient.svg)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "30% 50%",
          backgroundSize: "100% 100%",
        }}
      >
        <Container sx={{ px: { xs: 1, sm: 4 } }}>
          <Box
            sx={{
              mb: 10,
              pt: 8,
              width: { xs: "100%", sm: "80%", md: "65%" },
              mx: "auto",
              textAlign: "center",
            }}
          >
            <Typography
              mb={{ xs: 2, md: 3 }}
              sx={{
                color: ({ palette }) => palette.purple[700],
                fontWeight: 700,
              }}
              variant="bpSmallCaps"
            >
              Hub
            </Typography>
            <Typography mb={3} variant="bpHeading1">
              Interactive, data-driven blocks to use in your projects
            </Typography>
            <Typography
              textAlign="center"
              sx={{
                color: ({ palette }) => palette.gray[70],
                maxWidth: "unset",
              }}
            >
              All open-source and free to use
            </Typography>
          </Box>
        </Container>
        <Container
          sx={{
            px: "6.5%",
            maxWidth: { md: 720, lg: 1200 },
          }}
        >
          <Grid
            columnSpacing={{ xs: 0, sm: 4 }}
            rowSpacing={4}
            sx={{
              position: "relative",
              zIndex: 2,
            }}
            container
          >
            {catalog
              ? catalog.map((block) => (
                  <Grid
                    key={block.pathWithNamespace}
                    item
                    xs={12}
                    sm={6}
                    lg={4}
                  >
                    <BlockCard data={block} />
                  </Grid>
                ))
              : Array.from(Array(6), (_, index) => index + 1).map((key) => (
                  <Grid key={key} item xs={12} sm={6} lg={4}>
                    <BlockCard loading />
                  </Grid>
                ))}
            {catalog && (
              <Grid item xs={12} sm={6} lg={4}>
                <BlockCardComingSoon />
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default HubPage;
