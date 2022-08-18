import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Breadcrumbs,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { formatDistance } from "date-fns";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import crypto from "node:crypto";
import { FunctionComponent } from "react";
import remarkGfm from "remark-gfm";

import { BlocksSlider } from "../../../components/blocks-slider";
import { FontAwesomeIcon } from "../../../components/icons";
import { Link } from "../../../components/link";
import { mdxComponents } from "../../../components/mdx/mdx-components";
import { BlockDataContainer } from "../../../components/pages/hub/block-data-container";
import {
  BlockExampleGraph,
  BlockSchema,
} from "../../../components/pages/hub/hub-utils";
import { apiClient } from "../../../lib/api-client";
import {
  excludeHiddenBlocks,
  ExpandedBlockMetadata as BlockMetadata,
  readBlockReadmeFromDisk,
  retrieveBlockFileContent,
} from "../../../lib/blocks";
import { isFork, isProduction } from "../../../lib/config";

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
      "Running locally: block hub iFrame has same origin as main app. Block code can make authenticated requests to main app API.",
    );
    return "";
  }

  // @see https://vercel.com/docs/concepts/deployments/generated-urls
  // @see https://vercel.com/docs/concepts/deployments/generated-urls#url-components
  const branchSlug = branch
    .toLowerCase()
    .replace(/\./g, "")
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
  const packagePath = `${shortname}/${blockSlug}`;

  // This API endpoint relies on the user existing in the db, and it will not work when the JSON files in hub/
  // are associated with users that haven't been created in your local db
  // @todo don't read all user blocks just to retrieve a single one - add a 'getBlock' API endpoint
  const { data } = await apiClient.getUserBlocks({
    shortname: shortname.replace(/^@/, ""),
  });

  const catalog = data?.blocks ?? [];

  const blockMetadata = catalog.find(
    (metadata) => metadata.packagePath === packagePath,
  );

  if (!blockMetadata) {
    // TODO: Render custom 404 page for blocks
    return { notFound: true };
  }

  const { schema, exampleGraph } = await retrieveBlockFileContent(
    blockMetadata,
  );

  const readmeMd = await readBlockReadmeFromDisk(blockMetadata);

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
      sliderItems: excludeHiddenBlocks(catalog).filter(
        ({ name }) => name !== blockMetadata.name,
      ),
      sandboxBaseUrl: generateSandboxBaseUrl(),
      schema,
      exampleGraph,
    },
    revalidate: 1800,
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
      <Head>
        <title>
          {`Block Protocol – ${blockMetadata.displayName} Block by ${shortname}`}
        </title>
      </Head>
      <Container>
        {isDesktopSize ? null : (
          <Box mb={1}>
            <Breadcrumbs
              separator={
                <FontAwesomeIcon
                  icon={faChevronRight}
                  sx={{
                    fontSize: 14,
                    color: ({ palette }) => palette.gray[40],
                  }}
                />
              }
            >
              <Link href="/">Home</Link>
              <Link href="/hub">Block Hub</Link>
              <Typography variant="bpSmallCopy" color="inherit">
                {blockMetadata.displayName}
              </Typography>
            </Breadcrumbs>
          </Box>
        )}

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
            <Box sx={{ mt: 2, display: { xs: "flex", md: "unset" } }}>
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
                sx={{ display: { xs: "flex", md: "unset" } }}
                variant="bpHeading1"
              >
                {blockMetadata.displayName}
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
                    {`Updated ${formatDistance(
                      new Date(blockMetadata.lastUpdated),
                      new Date(),
                      {
                        addSuffix: true,
                      },
                    )}`}
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
