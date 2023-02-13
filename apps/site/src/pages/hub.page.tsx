import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Box, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";

import { BlockCard } from "../components/block-card";
import { BlockProtocolIcon, FontAwesomeIcon } from "../components/icons";
import { Link } from "../components/link";
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
      <Container
        sx={(theme) => ({
          pb: 4,
          mb: 4.25,
          pt: 10,
          textAlign: "center",

          [theme.breakpoints.down("sm")]: {
            mb: 1,
            pb: 1,
          },
        })}
      >
        <Typography
          mb={3.25}
          variant="bpSubtitle"
          // @todo check this
          fontSize={42}
          fontFamily={COPY_FONT_FAMILY}
          fontWeight={300}
          color={(theme) => theme.palette.gray[50]}
          letterSpacing="-0.03em"
        >
          <BlockProtocolIcon
            sx={(theme) => ({
              fontSize: 45,
              marginRight: 2,
              color: theme.palette.purple[90],
            })}
          />
          <Box component="span" sx={{ verticalAlign: "middle" }}>
            <Box
              component="strong"
              fontWeight={700}
              color={(theme) => theme.palette.purple[80]}
            >
              blocks
            </Box>
            ,{" "}
            <Box
              component="strong"
              fontWeight={700}
              color={(theme) => theme.palette.purple[70]}
            >
              types
            </Box>
            , and{" "}
            <Box
              component="strong"
              fontWeight={700}
              color={(theme) => theme.palette.purple[60]}
            >
              services
            </Box>
          </Box>
        </Typography>
        <Typography
          mb={3}
          variant="bpHeading4"
          color={(theme) => theme.palette.bpGray[80]}
          fontFamily={COPY_FONT_FAMILY}
          fontSize={24}
          letterSpacing="-0.02em"
        >
          <Box component="span" sx={{ verticalAlign: "middle" }}>
            Open-source components for
          </Box>
          <BlockProtocolIcon
            sx={{
              fontSize: 21,
              mx: 1,
              color: "inherit",
            }}
          />
          <Box component="span" sx={{ verticalAlign: "middle" }}>
            applications that work instantly without setup
          </Box>
        </Typography>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1.25}
        >
          <Chip
            sx={(theme) => ({
              fontSize: 12,
              color: theme.palette.purple[70],
              backgroundColor: theme.palette.purple[20],
              height: 26,
            })}
            label={
              <>
                <BlockProtocolIcon sx={{ fontSize: 12, mr: 0.5 }} />
                <Box
                  component="span"
                  sx={{
                    verticalAlign: "middle",
                    fontFamily: COPY_FONT_FAMILY,
                    fontWeight: 700,
                  }}
                >
                  {" "}
                  NEW TO THE BP?
                </Box>
              </>
            }
          />
          <Link href="/docs" display="flex" alignItems="center">
            Discover how blocks and types work{" "}
            <FontAwesomeIcon icon={faChevronRight} sx={{ ml: 0.75 }} />
          </Link>
        </Stack>
      </Container>

      <Box
        sx={(theme) => ({
          position: "relative",
          backgroundImage: "url(/assets/hub-gradient.svg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          borderBottom: 1,
          borderColor: theme.palette.gray[30],
          pb: 7,
        })}
      >
        <Container>
          <Grid
            columnSpacing={2}
            rowSpacing={2}
            sx={{
              position: "relative",
              zIndex: 2,
            }}
            container
          >
            <Grid
              item
              xs={12}
              mb={{ xs: -1, sm: 2 }}
              textAlign={{ xs: "center", sm: "left" }}
            >
              <Typography variant="bpHeading5" fontWeight={500} fontSize={18}>
                FEATURED BLOCKS
              </Typography>
            </Grid>
            {catalog.map((block) => (
              <Grid key={block.pathWithNamespace} item xs={12} sm={4}>
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
