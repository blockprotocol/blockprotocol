import {
  Breadcrumbs,
  Container,
  Typography,
  Icon,
  Box,
  useMediaQuery,
  useTheme,
  SxProps,
  Theme,
} from "@mui/material";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useMemo, VoidFunctionComponent } from "react";

import { BlocksSlider } from "../../components/pages/home/BlocksSlider";
import {
  blockDependencies,
  BlockDependency,
  BlockExports,
  BlockSchema,
} from "../../components/pages/hub/HubUtils";
import { BlockMetadata } from "../api/blocks.api";
import { BlockDataContainer } from "../../components/pages/hub/BlockDataContainer";
import { Link } from "../../components/Link";

const ChevronRight: React.VFC = () => (
  <Icon sx={{ fontSize: "0.8rem" }} className="fas fa-chevron-right" />
);

const BreadcrumbLink: React.FC<{ href: string; sx?: SxProps<Theme> }> = ({
  children,
  href,
  sx,
}) => {
  return (
    // @todo remove underline, underline=none or textDecoration none isn't working
    <Link underline="none" href={href}>
      <Typography
        variant="bpSmallCopy"
        sx={{
          ...sx,
          textDecoration: "none",
        }}
      >
        {children}
      </Typography>
    </Link>
  );
};

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
};

type BlockPageQueryParams = {
  org?: string[];
  block?: string[];
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

const parseQueryParams = ({ org, block }: BlockPageQueryParams) => {
  const orgShortname = org
    ? typeof org === "string"
      ? org
      : org.length === 1
      ? org[0]
      : undefined
    : undefined;

  if (!orgShortname) {
    throw new Error("Could not parse org shortname from query");
  }

  const blockSlug = block
    ? typeof block === "string"
      ? block
      : block.length === 1
      ? block[0]
      : undefined
    : undefined;

  if (!orgShortname) {
    throw new Error("Could not parse block slug from query");
  }

  return { orgShortname, blockSlug };
};

export const getStaticProps: GetStaticProps<
  BlockPageProps,
  BlockPageQueryParams
> = async ({ params }) => {
  const { orgShortname, blockSlug } = parseQueryParams(params || {});

  const metadata: BlockMetadata = await fetch(
    `${BASE_URL}/blocks/${orgShortname}/${blockSlug}/metadata.json`,
  ).then((res) => res.json());

  const [schema, blockStringifiedSource] = await Promise.all([
    fetch(
      `${BASE_URL}/blocks/${orgShortname}/${blockSlug}/${metadata.schema}`,
    ).then((res) => res.json()),
    fetch(
      `${BASE_URL}/blocks/${orgShortname}/${blockSlug}/${metadata.source}`,
    ).then((res) => res.text()),
  ]);

  return {
    props: {
      metadata,
      schema,
      blockStringifiedSource,
    },
  };
};

const BlockPage: NextPage<BlockPageProps> = ({
  metadata,
  schema,
  blockStringifiedSource,
}) => {
  const { query } = useRouter();
  const { orgShortname, blockSlug } = parseQueryParams(query || {});

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

  return (
    <Container sx={{ marginTop: 5, marginBottom: 10 }}>
      {!isDesktopSize && (
        <Box mb={1}>
          <Breadcrumbs separator={<ChevronRight />}>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
            <BreadcrumbLink href="/hub">Block Hub</BreadcrumbLink>
            <BreadcrumbLink sx={{ color: "#6048E5" }} href="">
              {metadata.displayName}
            </BreadcrumbLink>
          </Breadcrumbs>
        </Box>
      )}

      <Box sx={{ display: "flex" }}>
        {isDesktopSize && (
          <Typography variant="bpHeading1">
            <Box
              sx={{ display: "inline-block", height: "2em", width: "2em" }}
              component="img"
              src={`/blocks/${orgShortname}/${blockSlug}/${metadata.icon}`}
            />
          </Typography>
        )}

        <div>
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
                src={`/blocks/${orgShortname}/${blockSlug}/${metadata.icon}`}
              />
            )}
            {metadata.displayName}
          </Typography>
          <Typography variant="bpBodyCopy">
            <div style={{ color: "#4D5C6C" }}>{metadata.description}</div>
          </Typography>
          <Typography variant="bpSmallCopy" sx={{ color: "#64778C" }}>
            <div>
              By {orgShortname}
              <Bullet /> V{metadata.version}{" "}
              {isDesktopSize && (
                <>
                  <Bullet /> Updated Recently
                </>
              )}
            </div>
            {!isDesktopSize && <div>Updated Recently</div>}
          </Typography>
        </div>
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

      <Typography
        variant="bpHeading2"
        mb={3}
        mt={10}
        sx={{ textAlign: "center" }}
      >
        Explore more blocks
      </Typography>

      <BlocksSlider />
    </Container>
  );
};

export default BlockPage;
