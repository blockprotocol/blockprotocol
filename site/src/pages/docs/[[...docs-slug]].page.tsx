import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { Box, Paper, Typography } from "@mui/material";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { useContext } from "react";

import siteMap from "../../../site-map.json";
import { FontAwesomeIcon } from "../../components/icons";
import { Link } from "../../components/link";
import { LinkButton } from "../../components/link-button";
import { DocsContent } from "../../components/pages/docs/docs-content";
import SiteMapContext from "../../context/site-map-context";
import { SiteMap } from "../../lib/sitemap";
import { getSerializedPage } from "../../util/mdx-utils";

const documentationPages = (siteMap as SiteMap).pages.find(
  ({ title }) => title === "Documentation",
)!.subPages;

type DocsPageQueryParams = {
  "docs-slug"?: string[];
};

type DocsPageProps = {
  serializedPage: MDXRemoteSerializeResult<Record<string, unknown>>;
};

export const getStaticPaths: GetStaticPaths<DocsPageQueryParams> = async () => {
  const possibleHrefs = documentationPages
    .flatMap((page) => [page, ...page.subPages])
    .map(({ href }) => href);

  const paths = possibleHrefs.map((href) => ({
    params: {
      "docs-slug": href
        .replace("/docs", "")
        .split("/")
        .filter((item) => !!item),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  DocsPageProps,
  DocsPageQueryParams
> = async ({ params }) => {
  const docsSlug = (params || {})["docs-slug"];

  // As of Jan 2022, { fallback: false } in getStaticPaths does not prevent Vercel
  // from calling getStaticProps for unknown pages. This causes 500 instead of 404:
  //
  //   Error: ENOENT: no such file or directory, open '{...}/_pages/docs/undefined'
  //
  // Using try / catch prevents 500, but we might not need them in Next v12+.
  try {
    const serializedPage = await getSerializedPage({
      pathToDirectory: "docs",
      parts: docsSlug && docsSlug.length ? docsSlug : ["index"],
    });

    return {
      props: {
        serializedPage,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

const gitHubInfoCard = (
  <Paper
    variant="teal"
    sx={{
      marginBottom: {
        xs: 3,
        md: 5,
      },
      padding: 3,
      display: "flex",
      alignItems: "stretch",
      flexDirection: {
        xs: "column",
        md: "row",
      },
      maxWidth: { xs: "100%", lg: "1012px" },
    }}
  >
    <Box
      mr={2}
      sx={{
        display: {
          xs: "none",
          md: "block",
        },
      }}
    >
      <FontAwesomeIcon
        sx={{
          color: ({ palette }) => palette.teal[600],
          fontSize: 18,
        }}
        icon={faExclamationTriangle}
      />
    </Box>
    <Box
      mr={2}
      flexGrow={1}
      sx={{
        marginBottom: {
          xs: 2,
          md: 0,
        },
      }}
    >
      <Typography
        variant="bpLargeText"
        sx={{
          fontSize: 18,
          fontWeight: 600,
          color: ({ palette }) => palette.teal[600],
        }}
        marginBottom={1}
      >
        This document is a working draft
      </Typography>
      <Typography
        variant="bpBodyCopy"
        sx={(theme) => ({
          color: theme.palette.teal[600],
          fontSize: 15,
          lineHeight: 1.5,
          a: {
            color: theme.palette.teal[600],
            borderColor: theme.palette.teal[600],
            ":hover": {
              color: theme.palette.teal[700],
              borderColor: theme.palette.teal[700],
            },
          },
        })}
        maxWidth="62ch"
      >
        This specification is currently in progress. We’re drafting it in public
        to gather feedback and improve the final document. If you have any
        suggestions or improvements you would like to add, or questions you
        would like to ask, feel free to submit a PR or open a discussion on{" "}
        <Link
          href="https://github.com/blockprotocol/blockprotocol"
          sx={{ ":focus-visible": { outlineColor: "currentcolor" } }}
        >
          our GitHub repo
        </Link>
        .
      </Typography>
    </Box>
    <Box
      display="flex"
      flexShrink={0}
      alignItems="flex-end"
      sx={{
        justifyContent: {
          xs: "center",
          sm: "flex-start",
        },
      }}
    >
      <LinkButton
        href="https://github.com/blockprotocol/blockprotocol/tree/main/site/src/_pages/spec"
        variant="primary"
        color="teal"
        size="small"
        startIcon={<FontAwesomeIcon icon={faGithub} />}
        sx={{
          textTransform: "none",
        }}
      >
        View the spec on GitHub
      </LinkButton>
    </Box>
  </Paper>
);

const DocsPage: NextPage<DocsPageProps> = ({ serializedPage }) => {
  const { asPath } = useRouter();
  const { pages: allPages } = useContext(SiteMapContext);

  const { subPages } = allPages.find(({ title }) => title === "Documentation")!;

  const flatSubPages = subPages.flatMap((page) =>
    page.subPages?.length ? page.subPages : [page],
  );
  const currentPage = flatSubPages.find(
    ({ href }) => asPath === href || asPath.startsWith(`${href}#`),
  );

  const isSpec = currentPage!.href.startsWith("/docs/spec");

  return (
    <>
      <Head>
        <title>
          Block Protocol - {isSpec ? "Specification" : "Documentation"}
        </title>
      </Head>
      <DocsContent
        content={serializedPage}
        pages={subPages}
        flatPages={flatSubPages}
        currentPage={currentPage}
        {...(isSpec
          ? {
              title: <>Specification</>,
              subtitle: (
                <>
                  The open-source protocol for creating interactive, data-driven
                  blocks
                </>
              ),
              hero: gitHubInfoCard,
            }
          : {})}
      />
    </>
  );
};

export default DocsPage;
