import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { Box, Paper, Typography } from "@mui/material";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { useContext } from "react";

import { FontAwesomeIcon } from "../../components/icons";
import { Link } from "../../components/link";
import { LinkButton } from "../../components/link-button";
import { DocsContent } from "../../components/pages/docs/docs-content";
import SiteMapContext from "../../context/site-map-context";
import { getAllPageHrefs, getSerializedPage } from "../../util/mdx-utils";

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

type SpecPageProps = {
  serializedPage: MDXRemoteSerializeResult<Record<string, unknown>>;
};

type SpecPageQueryParams = {
  "spec-slug"?: string[];
};

export const getStaticPaths: GetStaticPaths<SpecPageQueryParams> = async () => {
  const paths = getAllPageHrefs({ folderName: "spec" }).map((href) => ({
    params: {
      "spec-slug": href
        .replace("/spec", "")
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
  SpecPageProps,
  SpecPageQueryParams
> = async ({ params }) => {
  const specSlug = (params || {})["spec-slug"];

  const fileNameWithoutIndex =
    specSlug && specSlug.length > 0 ? specSlug[0]! : "index";

  // As of Jan 2022, { fallback: false } in getStaticPaths does not prevent Vercel
  // from calling getStaticProps for unknown pages. This causes 500 instead of 404:
  //
  //   Error: ENOENT: no such file or directory, open '{...}/_pages/docs/undefined'
  //
  // Using try / catch prevents 500, but we might not need them in Next v12+.
  try {
    const serializedPage = await getSerializedPage({
      pathToDirectory: "spec",
      fileNameWithoutIndex,
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

const SpecPage: NextPage<SpecPageProps> = ({ serializedPage }) => {
  const { asPath } = useRouter();
  const { pages: allPages } = useContext(SiteMapContext);

  const { subPages: specificationPages } = allPages.find(
    ({ title }) => title === "Specification",
  )!;

  const currentPage = specificationPages.find(
    ({ href }) => asPath === href || asPath.startsWith(`${href}#`),
  );

  return (
    <>
      <Head>
        <title>Block Protocol - Specification</title>
      </Head>
      <DocsContent
        title={<>Specification</>}
        subtitle={
          <>
            The open-source protocol for creating interactive, data-driven
            blocks
          </>
        }
        hero={gitHubInfoCard}
        content={serializedPage}
        pages={specificationPages}
        currentPage={currentPage}
      />
    </>
  );
};

export default SpecPage;
