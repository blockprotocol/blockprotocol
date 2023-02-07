import { Box, Container, Grid, Typography } from "@mui/material";
import { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";

import { BlockCard } from "../components/block-card";
import { BlockProtocolIcon } from "../components/icons";
import { getFeaturedBlocks } from "../lib/api/blocks/get";
import {
  excludeHiddenBlocks,
  ExpandedBlockMetadata as BlockMetadata,
} from "../lib/blocks";
import { COPY_FONT_FAMILY } from "../theme/typography";

interface PageProps {
  catalog: BlockMetadata[];
}

/**
 * used to create an index of all available blocks, the catalog
 */
export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const blocks = await getFeaturedBlocks();
  const catalog = excludeHiddenBlocks(blocks);

  return {
    props: { catalog },
  };
};

const HubPage: NextPage<PageProps> = ({ catalog }) => {
  return (
    <>
      <NextSeo
        title="Block Protocol – Hub"
        description="The Block Protocol's registry of open-source blocks and types"
      />
      <Container sx={{ px: { xs: 1, sm: 4 } }}>
        <Box
          sx={{
            mb: 10,
            pt: 8,
            textAlign: "center",
          }}
        >
          <Typography
            mb={{ xs: 2, md: 3 }}
            variant="bpSubtitle"
            // @todo check this
            fontSize={52}
            fontFamily={COPY_FONT_FAMILY}
            fontWeight={700}
          >
            <BlockProtocolIcon sx={{ fontSize: 45, marginRight: 2 }} />
            blocks, types, and endpoints
          </Typography>
          <Typography
            mb={3}
            variant="bpHeading4"
            color={(theme) => theme.palette.gray[90]}
            fontFamily={COPY_FONT_FAMILY}
          >
            Open-source components for <strong>Þ</strong> applications that work
            instantly without setup
          </Typography>
        </Box>
      </Container>

      <Box
        sx={(theme) => ({
          position: "relative",
          backgroundImage: "url(/assets/hub-gradient.svg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: 650,
          overflow: "hidden",
          borderBottom: 1,
          borderColor: theme.palette.gray[30],
        })}
      >
        <Container
          sx={{
            px: "6.5%",
            maxWidth: { md: 720, lg: 1200 },
          }}
        >
          <Typography variant="bpHeading5">Featured Blocks</Typography>
          <Grid
            columnSpacing={{ xs: 0, sm: 4 }}
            rowSpacing={4}
            sx={{
              position: "relative",
              zIndex: 2,
            }}
            container
          >
            {catalog.map((block) => (
              <Grid key={block.pathWithNamespace} item xs={12} sm={6} lg={4}>
                <BlockCard data={block} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default HubPage;
