import { extractVersion } from "@blockprotocol/type-system";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Chip,
  Container,
  Grid,
  Stack,
  svgIconClasses,
  Typography,
} from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";

import { BlockCard } from "../components/block-card";
import { BlockProtocolIcon, FontAwesomeIcon } from "../components/icons";
import { Link } from "../components/link";
import { HubItemDescription, HubList } from "../components/pages/hub/hub";
import { getRouteHubBrowseType } from "../components/pages/hub/hub-utils";
import { getAllBlocks, getFeaturedBlocks } from "../lib/api/blocks/get";
import { apiClient } from "../lib/api-client";
import { ExpandedBlockMetadata as BlockMetadata } from "../lib/blocks";
import { excludeHiddenBlocks } from "../lib/excluded-blocks";
import { COPY_FONT_FAMILY } from "../theme/typography";

export const HUB_SERVICES_ENABLED = false;

interface PageProps {
  featuredBlocks: BlockMetadata[];
  listing: HubItemDescription[];
}

const getHubItems: Record<string, () => Promise<HubItemDescription[] | null>> =
  {
    async blocks() {
      const blocks = await getAllBlocks();

      return excludeHiddenBlocks(blocks).map(
        (item): HubItemDescription => ({
          image: item.icon,
          author: item.author,
          title: item.displayName ?? "",
          description: item.description ?? "",
          updated: item.lastUpdated ?? "",
          version: item.version,
          url: item.blockSitePath,
          verified: item.verified,
        }),
      );
    },
    async types() {
      const types = await apiClient.getEntityTypes({ latestOnly: true });

      return (
        types.data?.entityTypes.map(
          (type): HubItemDescription => ({
            title: type.schema.title,
            author: type.schema.$id.match(/@(.*?)\//)?.[1] ?? "",
            description: type.schema.description,
            url: type.schema.$id,
            version: `${extractVersion(type.schema.$id)}`,
          }),
        ) ?? []
      );
    },
    async services() {
      return HUB_SERVICES_ENABLED ? [] : null;
    },
  };

/**
 * used to create an index of all available blocks, the catalog
 */
export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context,
) => {
  const browseType = getRouteHubBrowseType(context.query);
  const [featuredBlocks, listing] = await Promise.all([
    getFeaturedBlocks(),
    getHubItems[browseType]?.() ?? null,
  ]);

  if (!listing) {
    return {
      redirect: {
        destination: "/hub",
        permanent: false,
      },
    };
  }

  return {
    props: {
      featuredBlocks: excludeHiddenBlocks(featuredBlocks),
      listing,
    },
  };
};

const HubPage: NextPage<PageProps> = ({ featuredBlocks, listing }) => {
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
          fontSize={42}
          fontFamily={COPY_FONT_FAMILY}
          fontWeight={300}
          sx={{ color: "gray.50" }}
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
              sx={{ color: "purple.80" }}
            >
              blocks
            </Box>
            {HUB_SERVICES_ENABLED ? <>,</> : <> and</>}{" "}
            <Box
              component="strong"
              fontWeight={700}
              sx={{ color: "purple.70" }}
            >
              types
            </Box>
            {HUB_SERVICES_ENABLED ? (
              <>
                , and{" "}
                <Box
                  component="strong"
                  fontWeight={700}
                  sx={{ color: "purple.60" }}
                >
                  services
                </Box>
              </>
            ) : null}
          </Box>
        </Typography>
        <Typography
          mb={3}
          variant="bpHeading4"
          sx={{ color: "bpGray.80" }}
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
        <Link
          href="/docs"
          alignItems="center"
          fontWeight={500}
          className="docs-link"
        >
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
                cursor: "pointer",
                transition: theme.transitions.create([
                  "color",
                  "backgroundColor",
                ]),
                ".docs-link:hover &": {
                  color: theme.palette.purple[50],
                  backgroundColor: theme.palette.purple[100],
                },
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
            <Box
              display="flex"
              alignItems="center"
              sx={(theme) => ({
                [`&, .${svgIconClasses.root}`]: {
                  transition: theme.transitions.create("color"),
                },
                ".docs-link:hover &": {
                  [`&, .${svgIconClasses.root}`]: {
                    color: theme.palette.purple[500],
                  },
                },
              })}
            >
              Discover how blocks and types work
              <FontAwesomeIcon icon={faChevronRight} sx={{ ml: 0.75 }} />
            </Box>
          </Stack>
        </Link>
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
            {featuredBlocks.map((block) => (
              <Grid key={block.pathWithNamespace} item xs={12} sm={4}>
                <BlockCard data={block} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <HubList listing={listing} />
    </>
  );
};

export default HubPage;
