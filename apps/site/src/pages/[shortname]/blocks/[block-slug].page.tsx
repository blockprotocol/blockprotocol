import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
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
import { isProduction } from "../../../lib/config";
import { excludeHiddenBlocks } from "../../../lib/excluded-blocks";

// Exclude <FooBar />, but keep <h1 />, <ul />, etc.
const markdownComponents = Object.fromEntries(
  Object.entries(mdxComponents).filter(
    ([key]) => key[0]?.toLowerCase() === key[0],
  ),
);

/**
 * Resolves the origin used for the block sandbox iframe.
 *
 * In PRODUCTION the parent docs page and the sandbox iframe MUST live on
 * different origins so block code can't reach cookies issued to the main
 * blockprotocol.org app. {@link NEXT_PUBLIC_BLOCK_SANDBOX_URL} carries that
 * sibling host (e.g. `https://blocks.blockprotocol.org`); the middleware
 * additionally moves `…/sandboxed-demo` requests onto it (see
 * `middleware.page.ts`).
 *
 * In PREVIEW we don't have a stable wildcard sibling per branch. The earlier
 * approach — synthesizing `blockprotocol-git-{branchSlug}.stage.hash.ai`
 * from the branch name and hoping a `*.stage.hash.ai` wildcard pointed at the
 * matching Vercel preview — broke as soon as branch names started getting
 * Vercel-supplied team/project hashes that this code can't see (long branch
 * names hit the 63-char DNS-label cap and get a SHA-derived suffix that does
 * not match Vercel's actual alias). The result is a hostname like
 * `blockprotocol-git-cursor-…-7dab.stage.hash.ai` that simply has no DNS,
 * and the iframe shows "refused to connect".
 *
 * Instead, fall back to the deployment's own Vercel URL (`VERCEL_BRANCH_URL`
 * for the stable per-branch alias, else the per-deployment `VERCEL_URL`).
 * That URL is guaranteed to resolve to the same Next app the parent page is
 * served from, so the iframe loads. We trade cross-origin cookie isolation
 * for reliability in non-production: the iframe `sandbox` attribute still
 * provides JS-level isolation, and preview deployments aren't authenticated
 * surfaces. Set {@link NEXT_PUBLIC_BLOCK_SANDBOX_URL} on a preview to opt
 * back into a sibling origin (e.g. for testing the cookie-isolation path).
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

  if (process.env.NEXT_PUBLIC_BLOCK_SANDBOX_URL) {
    return process.env.NEXT_PUBLIC_BLOCK_SANDBOX_URL;
  }

  // Vercel exposes both env vars on preview deployments. Prefer the per-branch
  // alias (stable across redeploys of the same branch) and fall back to the
  // per-deployment URL.
  const previewHost =
    process.env.VERCEL_BRANCH_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL;

  if (!previewHost) {
    // eslint-disable-next-line no-console
    console.warn(
      "Running locally: Hub iFrame has same origin as main app. Block code can make authenticated requests to main app API.",
    );
    return "";
  }

  return previewHost.startsWith("http") ? previewHost : `https://${previewHost}`;
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
  shortname: string;
  "block-slug": string;
};

const parseQueryParams = (
  params: BlockPageQueryParams | Record<string, string | string[] | undefined>,
) => {
  // Handle useRouter query which can have string | string[] values
  const rawShortname = params.shortname;
  const shortname = rawShortname
    ? typeof rawShortname === "string"
      ? rawShortname
      : rawShortname[0]
    : undefined;

  if (!shortname) {
    throw new Error("Could not parse org shortname from query");
  }

  const rawBlockSlug = params["block-slug"];
  const blockSlug = rawBlockSlug
    ? typeof rawBlockSlug === "string"
      ? rawBlockSlug
      : rawBlockSlug[0]
    : undefined;

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

export const getServerSideProps: GetServerSideProps<BlockPageProps> = async (
  context,
) => {
  const { params } = context;

  const shortname = params?.shortname as string | undefined;
  const blockSlug = params?.["block-slug"] as string | undefined;

  if (typeof shortname !== "string" || !shortname.startsWith("@")) {
    return { notFound: true };
  }

  if (typeof blockSlug !== "string") {
    return { notFound: true };
  }

  const pathWithNamespace = `${shortname}/${blockSlug}`;

  let blocks: Awaited<ReturnType<typeof getAllBlocks>>;
  try {
    blocks = await getAllBlocks();
  } catch {
    return { notFound: true };
  }

  const blockMetadata = blocks.find(
    (metadata) => metadata.pathWithNamespace === pathWithNamespace,
  );

  if (!blockMetadata) {
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

  // Set cache headers for CDN caching (similar to revalidate behavior)
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=180, stale-while-revalidate=300",
  );

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
                objectFit: "contain",
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
                    objectFit: "contain",
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
