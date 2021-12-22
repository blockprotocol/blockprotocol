import {
  Breadcrumbs,
  Container,
  Typography,
  Icon,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState, VoidFunctionComponent } from "react";

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

const BreadcrumbLink: React.FC<{ href: string }> = ({ children, href }) => (
  // @todo underline=none or textDecoration none isn't working
  <Link underline="none" href={href}>
    <Typography variant="bpSmallCopy" sx={{ textDecoration: "none" }}>
      {children}
    </Typography>
  </Link>
);

interface PageState {
  schema?: BlockSchema;
  metadata?: BlockMetadata;
  blockModule?: BlockExports;
}

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

const Block: NextPage = () => {
  const { org, block } = useRouter().query;

  const [{ metadata, schema, blockModule }, setPageState] = useState<PageState>(
    {},
  );

  const theme = useTheme();

  const md = useMediaQuery(theme.breakpoints.up("md"));
  const isDesktopSize = md;

  useEffect(() => {
    if (!org || !block) return;
    void fetch(`/blocks/${org}/${block}/metadata.json`)
      .then((res) => res.json())
      .then((metadata_) =>
        Promise.all([
          metadata_,
          fetch(`/blocks/${org}/${block}/${metadata_.schema}`).then((res) =>
            res.json(),
          ),
          fetch(`/blocks/${org}/${block}/${metadata_.source}`).then((res) =>
            res.text(),
          ),
        ]),
      )
      .then(([metadata_, schema_, source]) => {
        setPageState({
          metadata: metadata_,
          schema: schema_,
          blockModule: blockEval(source),
        });
      });
  }, [org, block]);

  if (!metadata || !schema) return null;

  return (
    <Container sx={{ marginTop: 5, marginBottom: 10 }}>
      {!isDesktopSize && (
        <Box mb={1}>
          <Breadcrumbs separator={<ChevronRight />}>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
            <BreadcrumbLink href="/gallery">Block Hub</BreadcrumbLink>
            <BreadcrumbLink href={`/${org}/${metadata.name}`}>
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
              src={`/blocks/${org}/${block}/${metadata.icon}`}
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
                src={`/blocks/${org}/${block}/${metadata.icon}`}
              />
            )}
            {metadata.displayName}
          </Typography>
          <Typography variant="bpBodyCopy">
            <div style={{ color: "#4D5C6C" }}>{metadata.description}</div>
          </Typography>
          <Typography variant="bpSmallCopy" sx={{ color: "#64778C" }}>
            <div>
              By {org}
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

export default Block;
