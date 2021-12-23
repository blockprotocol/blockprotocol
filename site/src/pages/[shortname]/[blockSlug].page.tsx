import {
  Breadcrumbs,
  Container,
  Typography,
  Icon,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useMemo, VoidFunctionComponent } from "react";

import { formatDistance } from "date-fns";
import { BlocksSlider } from "../../components/BlocksSlider";
import {
  blockDependencies,
  BlockDependency,
  BlockExports,
  BlockSchema,
} from "../../components/pages/hub/HubUtils";
import { BlockMetadata, readBlocksFromDisk } from "../api/blocks.api";
import { BlockDataContainer } from "../../components/pages/hub/BlockDataContainer";
import { Link } from "../../components/Link";

const blockRequire = (name: BlockDependency) => {
  if (!(name in blockDependencies)) {
    throw new Error(`missing dependency ${name}`);
  }

  return blockDependencies[name];
};

const blockEval = (source: string): BlockExports => {
  const exports_ = {};
  const module_ = { exports: exports_ };

  // eslint-disable-next-line no-new-func
  const moduleFactory = new Function("require", "module", "exports", source);
  moduleFactory(blockRequire, module_, exports_);

  return module_.exports as BlockExports;
};

const Bullet: VoidFunctionComponent = () => {
  return (
    <Box component="span" mx={1.5} sx={{ color: "#DDE7F0" }}>
      •
    </Box>
  );
};

type BlockPageProps = {
  metadata: BlockMetadata;
  schema: BlockSchema;
  blockStringifiedSource: string;
  catalog: BlockMetadata[];
};

type BlockPageQueryParams = {
  shortname?: string[];
  blockSlug?: string[];
};

export const getStaticPaths: GetStaticPaths<
  BlockPageQueryParams
> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const BASE_URL = `http://${
  process.env.NEXT_PUBLIC_VERCEL_URL ?? "localhost:3000"
}`;

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

  const blockSlug = params.blockSlug
    ? typeof params.blockSlug === "string"
      ? params.blockSlug
      : params.blockSlug.length === 1
      ? params.blockSlug[0]
      : undefined
    : undefined;

  if (!blockSlug) {
    throw new Error("Could not parse block slug from query");
  }

  return { shortname, blockSlug };
};

export const getStaticProps: GetStaticProps<
  BlockPageProps,
  BlockPageQueryParams
> = async ({ params }) => {
  const { shortname, blockSlug } = parseQueryParams(params || {});

  const catalog = readBlocksFromDisk();

  const metadata: BlockMetadata = await fetch(
    `${BASE_URL}/blocks/${shortname}/${blockSlug}/block-metadata.json`,
  ).then((res) => res.json());

  metadata.lastUpdated = catalog.find(
    ({ name }) => name === metadata.name,
  )?.lastUpdated;

  const [schema, blockStringifiedSource] = await Promise.all([
    fetch(
      `${BASE_URL}/blocks/${shortname}/${blockSlug}/${metadata.schema}`,
    ).then((res) => res.json()),
    fetch(
      `${BASE_URL}/blocks/${shortname}/${blockSlug}/${metadata.source}`,
    ).then((res) => res.text()),
  ]);

  return {
    props: {
      metadata,
      schema,
      blockStringifiedSource,
      catalog,
    },
    revalidate: 10,
  };
};

const BlockPage: NextPage<BlockPageProps> = ({
  metadata,
  schema,
  blockStringifiedSource,
  catalog,
}) => {
  const { query } = useRouter();
  const { shortname, blockSlug } = parseQueryParams(query || {});

  const blockModule = useMemo(
    () =>
      typeof window === "undefined"
        ? undefined
        : blockEval(blockStringifiedSource),
    [blockStringifiedSource],
  );

  const theme = useTheme();

  const md = useMediaQuery(theme.breakpoints.up("md"));
  const isDesktopSize = md;

  const sliderItems = useMemo(() => {
    return catalog.filter(({ name }) => name !== metadata.name);
  }, [catalog, metadata]);

  return (
    <>
      <Head>
        <title>
          Block Protocol - {metadata.displayName} Block by {shortname}
        </title>
      </Head>
      <Container>
        {isDesktopSize ? null : (
          <Box mb={1}>
            <Breadcrumbs
              separator={
                <Icon
                  sx={{
                    fontSize: 14,
                    color: ({ palette }) => palette.gray[40],
                  }}
                  className="fas fa-chevron-right"
                />
              }
            >
              <Link href="/">Home</Link>
              <Link href="/hub">Block Hub</Link>
              <Typography variant="bpSmallCopy" color="inherit">
                {metadata.displayName}
              </Typography>
            </Breadcrumbs>
          </Box>
        )}

        <Box
          sx={{ display: "flex", pt: { xs: 4, md: 10 }, mb: { xs: 6, md: 12 } }}
        >
          {isDesktopSize ? (
            <Typography variant="bpHeading1">
              <Box
                sx={{ display: "inline-block", height: "2em", width: "2em" }}
                component="img"
                src={`/blocks/${shortname}/${blockSlug}/${metadata.icon}`}
              />
            </Typography>
          ) : null}

          <Box>
            <Typography
              sx={{ display: { xs: "flex", md: "unset" } }}
              variant="bpHeading1"
              mt={2}
            >
              {!isDesktopSize && (
                <Box
                  mr={1}
                  sx={{ display: "inline-block", height: "1em", width: "1em" }}
                  component="img"
                  src={`/blocks/${shortname}/${blockSlug}/${metadata.icon}`}
                />
              )}
              {metadata.displayName}
            </Typography>
            <Typography variant="bpBodyCopy">
              <Box sx={{ color: theme.palette.gray[70] }}>
                {metadata.description}
              </Box>
            </Typography>
            <Typography
              variant="bpSmallCopy"
              sx={{
                color: ({ palette }) => palette.gray[60],
              }}
            >
              <span>
                By{" "}
                <Box
                  component="span"
                  sx={{
                    fontWeight: 400,
                    color: ({ palette }) => palette.purple[700],
                    textDecoration: "underline",
                  }}
                >
                  {shortname}
                </Box>
              </span>
              <Bullet />
              <span>V{metadata.version}</span>
              {isDesktopSize && <Bullet />}
              <Box
                component="span"
                sx={{ display: { xs: "block", md: "inline-block" } }}
              >
                {`Updated ${
                  metadata.lastUpdated
                    ? formatDistance(
                        new Date(metadata.lastUpdated),
                        new Date(),
                        {
                          addSuffix: true,
                        },
                      )
                    : "Recently"
                }`}
              </Box>
            </Typography>
          </Box>
        </Box>

        <BlockDataContainer
          metadata={metadata}
          schema={schema}
          blockModule={blockModule}
        />

        {/* <div
        style={{ display: "grid", gridTemplateColumns: "60% 40%" }}
        className=" mb-10"
      >
        <div>
          <b>About</b>
          <p>
            Store information in rows and columns in a classic table layout.
            Longer description talking about parameters and how to use like a
            readme goes in here. Tables have filters, search, ability to add and
            remove columns and rows, multiple views. Tables have filters,
            search, ability to add and remove columns and rows, multiple views.
            Tables have filters, search, ability to add and remove columns and
            rows, multiple views. Tables have filters, search, ability to add
            and remove columns and rows, multiple views.
          </p>
        </div>
        <div>
          <b>Repository</b>
          <Box sx={{ display: "flex" }}>
            <img
              alt="GitHub Link"
              style={{ marginRight: 5 }}
              src="/assets/link.svg"
            />{" "}
            <Link href="https://github.com/hash/video">
              github.com/hash/video
            </Link>
          </Box>
        </div>
      </div> */}

        <Typography textAlign="center" variant="bpHeading2" mb={3} mt={10}>
          Explore more blocks
        </Typography>
      </Container>
      <BlocksSlider catalog={sliderItems} />
    </>
  );
};

export default BlockPage;
