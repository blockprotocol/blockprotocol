import { Box, Container, Grid, Typography } from "@mui/material";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";

import { BlockCard, BlockCardComingSoon } from "../components/block-card";
import { apiClient } from "../lib/api-client";
import {
  excludeHiddenBlocks,
  ExpandedBlockMetadata as BlockMetadata,
} from "../lib/blocks";

interface PageProps {
  catalog: BlockMetadata[];
}

/**
 * used to create an index of all available blocks, the catalog
 */
export const getStaticProps: GetStaticProps<PageProps> = async () => {
  // @todo replace with direct call to block model, when it exists
  const { data, error } = await apiClient.getBlocks();
  if (error) {
    // eslint-disable-next-line no-console -- server-side log. TODO: consider using logger
    console.error(
      `Error getting static props for hub index page: ${error.message}`,
    );
    throw error;
  }
  const catalog = data?.results ?? [];

  return {
    props: { catalog: excludeHiddenBlocks(catalog) },
  };
};

const HubPage: NextPage<PageProps> = ({ catalog }) => {
  return (
    <>
      <Head>
        <title>Block Protocol – Block Hub</title>
        <meta itemProp="name" content="Block Hub" />
        <meta
          itemProp="description"
          content="The Block Protocol's registry of open-source blocks"
        />
      </Head>
      <Box
        sx={{
          mb: 20,
          position: "relative",
          backgroundImage: "url(/assets/blockhub-gradient.svg)",
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
              Block Hub
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
                  <Grid key={block.packagePath} item xs={12} sm={6} lg={4}>
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
