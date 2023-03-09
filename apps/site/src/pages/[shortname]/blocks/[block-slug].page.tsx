import crypto from "node:crypto";

import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";
import { FunctionComponent } from "react";
import remarkGfm from "remark-gfm";

import { BlocksSlider } from "../../../components/blocks-slider";
import { ClientOnlyLastUpdated } from "../../../components/last-updated";
import { Link } from "../../../components/link";
import { mdxComponents } from "../../../components/mdx/mdx-components";
import { BlockDataContainer } from "../../../components/pages/hub/block-data-container";
import {
  BlockExampleGraph,
  BlockSchema,
} from "../../../components/pages/hub/hub-utils";
import { VerifiedBadge } from "../../../components/verified-badge";
import { getAllBlocks } from "../../../lib/api/blocks/get";
import {
  ExpandedBlockMetadata as BlockMetadata,
  retrieveBlockFileContent,
  retrieveBlockReadme,
} from "../../../lib/blocks";
import { isFork, isProduction } from "../../../lib/config";
import { excludeHiddenBlocks } from "../../../lib/excluded-blocks";

// Exclude <FooBar />, but keep <h1 />, <ul />, etc.
const markdownComponents = Object.fromEntries(
  Object.entries(mdxComponents).filter(
    ([key]) => key[0]?.toLowerCase() === key[0],
  ),
);

/**
 * We want a different origin for the iFrame to the parent window
 * so that it can't use cookies issued to the user in the main app.
 *
 * The PRODUCTION origin will be blockprotocol.org, and we can use
 * a custom domain or the unique Vercel deployment URL as the origin .
 *
 * In STAGING, we will mostly be visiting unique deployment URLs
 * for testing, so we can use the unique branch URL as the origin.
 * Note: this means the frame in preview deployments will always be
 * built from the tip of the branch - if you visit the non-latest preview
 * deployment AND you have changed the framed code, they may be out of sync.
 */
const generateSandboxBaseUrl = (): string => {
  if (isProduction) {
    const deploymentUrl =
      process.env.NEXT_PUBLIC_BLOCK_SANDBOX_URL ??
      process.env.NEXT_PUBLIC_VERCEL_URL;

    if (!deploymentUrl) {
      throw new Error(
        "Could not generate frame origin: production environment detected but no process.env.NEXT_PUBLIC_BLOCK_SANDBOX_URL or process.env.NEXT_PUBLIC_VERCEL_URL",
      );
    }

    return deploymentUrl;
  }

  const branch = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF;

  if (!branch) {
    // eslint-disable-next-line no-console
    console.warn(
      "Running locally: Hub iFrame has same origin as main app. Block code can make authenticated requests to main app API.",
    );
    return "";
  }

  // @see https://vercel.com/docs/concepts/deployments/generated-urls
  // @see https://vercel.com/docs/concepts/deployments/generated-urls#url-components
  const branchSlug = branch
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\//, "-")
    .replace(/[/_]/g, "")
    .replace(/[^\w-]+/g, "-");

  const projectName = "blockprotocol";
  const prefix = isFork ? "git-fork-" : "git-";
  const rawBranchSubdomain = `${projectName}-${prefix}${branchSlug}`;

  const branchSubdomain =
    rawBranchSubdomain.length > 63
      ? `${rawBranchSubdomain.slice(0, 56)}-${crypto
          .createHash("sha256")
          .update(prefix + branch + projectName)
          .digest("hex")
          .slice(0, 6)}`
      : rawBranchSubdomain;

  return `https://${branchSubdomain}.stage.hash.ai`;
};

const Bullet: FunctionComponent = () => {
  return (
    <Box component="span" mx={1.5} sx={{ color: "#DDE7F0" }}>
      •
    </Box>
  );
};

type BlockPageProps = {
  compiledReadme?: string;
  blockMetadata: BlockMetadata;
  sandboxBaseUrl: string;
  schema: BlockSchema;
  sliderItems: BlockMetadata[];
  exampleGraph: BlockExampleGraph | null; // todo fix typing
};

type BlockPageQueryParams = {
  shortname?: string[];
  "block-slug"?: string;
};

export const getStaticPaths: GetStaticPaths<
  BlockPageQueryParams
> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const parseQueryParams = (params: BlockPageQueryParams) => {
  const shortname = params.shortname
    ? typeof params.shortname === "string"
      ? params.shortname
      : params.shortname.length === 1
      ? params.shortname[0]
      : undefined
    : undefined;

  if (!shortname) {
    throw new Error("Could not parse org shortname from query");
  }

  const blockSlug = params["block-slug"];

  if (!blockSlug) {
    throw new Error("Could not parse block slug from query");
  }

  return { shortname, blockSlug };
};

/**
 * Helps display `github.com/org/repo` instead of a full URL with protocol, commit hash and path.
 * If a URL is not recognised as a GitHub repo, only `https://` is removed.
 */
const generateRepositoryDisplayUrl = (repository: string): string => {
  const repositoryUrlObject = new URL(repository);
  const displayUrl = `${repositoryUrlObject.hostname}${repositoryUrlObject.pathname}`;

  if (repositoryUrlObject.hostname === "github.com") {
    return displayUrl.split("/").slice(0, 3).join("/");
  }

  return displayUrl;
};

export const getStaticProps: GetStaticProps<
  BlockPageProps,
  BlockPageQueryParams
> = async ({ params }) => {
  const { shortname, blockSlug } = parseQueryParams(params || {});

  if (!shortname.startsWith("@")) {
    return { notFound: true };
  }
  const pathWithNamespace = `${shortname}/${blockSlug}`;

  const blocks = await getAllBlocks();

  const blockMetadata = blocks.find(
    (metadata) => metadata.pathWithNamespace === pathWithNamespace,
  );

  if (!blockMetadata) {
    // TODO: Render custom 404 page for blocks
    return { notFound: true };
  }

  const { schema, exampleGraph } = await retrieveBlockFileContent(
    blockMetadata,
  );

  const readmeMd = await retrieveBlockReadme(blockMetadata);

  const compiledReadme = readmeMd
    ? (
        await serialize(readmeMd, {
          mdxOptions: {
            format: "md",
            remarkPlugins: [
              remarkGfm, // GitHub-flavoured markdown (includes automatic detection of URLs)
            ],
          },
        })
      ).compiledSource
    : undefined;

  return {
    props: {
      blockMetadata,
      ...(compiledReadme ? { compiledReadme } : {}), // https://github.com/vercel/next.js/discussions/11209
      sliderItems: excludeHiddenBlocks(blocks).filter(
        ({ name }) => name !== blockMetadata.name,
      ),
      sandboxBaseUrl: generateSandboxBaseUrl(),
      schema,
      exampleGraph,
    },
    revalidate: 180,
  };
};

const BlockPage: NextPage<BlockPageProps> = ({
  compiledReadme,
  blockMetadata,
  sandboxBaseUrl,
  schema,
  sliderItems,
  exampleGraph,
}) => {
  const { query } = useRouter();
  const { shortname } = parseQueryParams(query || {});

  const theme = useTheme();

  const md = useMediaQuery(theme.breakpoints.up("md"));
  const isDesktopSize = md;

  const repositoryDisplayUrl = blockMetadata.repository
    ? generateRepositoryDisplayUrl(blockMetadata.repository)
    : "";

  return (
    <>
      <NextSeo
        title={`${blockMetadata.displayName} Block – ${shortname} - Block Protocol`}
        description={
          blockMetadata.description ||
          "Check out this open-source block on the Hub"
        }
        openGraph={{
          images: [
            {
              url:
                blockMetadata?.image ||
                "https://blockprotocol.org/assets/default-block-img.svg",
            },
          ],
        }}
      />
      <Container>
        <Box
          sx={{
            display: "flex",
            pt: { xs: 4, md: 10 },
            mb: { xs: 10, md: 12 },
          }}
        >
          {isDesktopSize ? (
            <Box
              sx={{
                display: "inline-block",
                mr: 3,
                height: 108,
                width: 108,
              }}
              component="img"
              src={blockMetadata.icon ?? undefined}
            />
          ) : null}

          <Box>
            <Box sx={{ display: { xs: "flex", md: "unset" } }}>
              {!isDesktopSize && (
                <Box
                  sx={{
                    display: "inline-block",
                    height: 44,
                    width: 44,
                    mr: 2,
                  }}
                  component="img"
                  src={blockMetadata.icon ?? undefined}
                />
              )}
              <Typography
                variant="bpHeading1"
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  columnGap: 2.5,
                  rowGap: 0.5,
                }}
              >
                <Box component="span">{blockMetadata.displayName} </Box>

                {blockMetadata.verified ? <VerifiedBadge /> : null}
              </Typography>
            </Box>

            <Typography
              variant="bpBodyCopy"
              sx={{ color: theme.palette.gray[80] }}
            >
              {blockMetadata.description}
            </Typography>
            <Typography
              variant="bpSmallCopy"
              sx={{
                color: ({ palette }) => palette.gray[70],
              }}
            >
              <span>
                By{" "}
                <Box
                  component="span"
                  sx={{
                    color: ({ palette }) => palette.purple[700],
                  }}
                >
                  <Link href={`/${shortname}`}>{shortname}</Link>
                </Box>
              </span>
              <Bullet />
              <span>V{blockMetadata.version}</span>
              {blockMetadata.lastUpdated ? (
                <>
                  {isDesktopSize && <Bullet />}
                  <Box
                    component="span"
                    sx={{ display: { xs: "block", md: "inline-block" } }}
                  >
                    <ClientOnlyLastUpdated value={blockMetadata.lastUpdated} />
                  </Box>
                </>
              ) : null}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: { xs: 16, md: 10 } }}>
          <BlockDataContainer
            metadata={blockMetadata}
            schema={schema}
            sandboxBaseUrl={sandboxBaseUrl}
            exampleGraph={exampleGraph}
          />
        </Box>

        {(blockMetadata.repository || compiledReadme) && (
          <Box
            mb={10}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 40%" },
              gridGap: { md: 60 },
              marginBottom: 10,
            }}
          >
            {compiledReadme ? (
              <Box
                sx={{
                  "& > h1:first-of-type": {
                    marginTop: 0,
                  },
                }}
                mb={{ xs: 2, md: 0 }}
                component="article"
              >
                <MDXRemote
                  compiledSource={compiledReadme}
                  components={markdownComponents}
                />
              </Box>
            ) : (
              <div />
            )}
            {blockMetadata.repository ? (
              <Box sx={{ overflow: "hidden" }} pl={{ xs: 0, md: 2 }}>
                <Typography
                  variant="bpLargeText"
                  component="h2"
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.gray[80],
                    marginBottom: 2,
                  }}
                >
                  Repository
                </Typography>
                <Box sx={{ display: "flex" }}>
                  <Box
                    component="img"
                    alt="GitHub Link"
                    sx={{ marginRight: 1.5 }}
                    src="/assets/link.svg"
                  />{" "}
                  <Link href={blockMetadata.repository}>
                    <Typography
                      variant="bpSmallCopy"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        borderBottom: `2px solid currentColor`,
                      }}
                    >
                      {repositoryDisplayUrl}
                    </Typography>
                  </Link>
                </Box>
              </Box>
            ) : null}
          </Box>
        )}
      </Container>
      <Box my={4}>
        <Typography textAlign="center" variant="bpHeading3" mb={2}>
          Explore more blocks
        </Typography>
        <BlocksSlider catalog={sliderItems} />
      </Box>
    </>
  );
};

export default BlockPage;
