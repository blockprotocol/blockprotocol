import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Container,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { useContext } from "react";

import { FontAwesomeIcon } from "../../components/icons";
import { Link } from "../../components/Link";
import { LinkButton } from "../../components/LinkButton";
import {
  MDX_TEXT_CONTENT_MAX_WIDTH,
  MdxPageContent,
} from "../../components/MdxPageContent";
import { PageNavLinks } from "../../components/PageNavLinks";
import Search from "../../components/pages/docs/Search";
import { Sidebar, SIDEBAR_WIDTH } from "../../components/PageSidebar";
import SiteMapContext from "../../context/SiteMapContext";
import { getAllPageHrefs, getSerializedPage } from "../../util/mdxUtils";
import { parseIntFromPixelString } from "../../util/muiUtils";

const GitHubInfoCard = (
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
  specSlug?: string[];
};

export const getStaticPaths: GetStaticPaths<SpecPageQueryParams> = async () => {
  const paths = getAllPageHrefs({ folderName: "spec" }).map((href) => ({
    params: {
      specSlug: href
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
  const { specSlug } = params || {};

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
  const theme = useTheme();
  const { asPath } = useRouter();
  const { pages: allPages } = useContext(SiteMapContext);

  const { subPages: specificationPages } = allPages.find(
    ({ title }) => title === "Specification",
  )!;

  const currentPageIndex = specificationPages.findIndex(
    ({ href }) => asPath === href || asPath.startsWith(`${href}#`),
  );

  const prevPage =
    currentPageIndex > 0 ? specificationPages[currentPageIndex - 1] : undefined;
  const nextPage =
    currentPageIndex < specificationPages.length - 1
      ? specificationPages[currentPageIndex + 1]
      : undefined;

  const md = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <>
      <Head>
        <title>Block Protocol - Specification</title>
      </Head>
      <Container
        sx={{
          marginTop: {
            xs: 6,
            md: 8,
          },
        }}
      >
        <Typography
          variant="bpTitle"
          sx={{
            marginBottom: 2,
          }}
        >
          Specification
        </Typography>
        <Typography
          variant="bpSubtitle"
          maxWidth={750}
          sx={{
            marginBottom: {
              xs: 6,
              md: 8,
            },
          }}
        >
          The open-source protocol for creating interactive, data-driven blocks
        </Typography>
        {GitHubInfoCard}
        <Box mb={4} display="flex" alignItems="flex-start">
          {md ? (
            <Sidebar
              flexGrow={0}
              marginRight={6}
              pages={specificationPages.filter(
                ({ title }) => !title.startsWith("Appendix"),
              )}
              appendices={specificationPages.filter(({ title }) =>
                title.startsWith("Appendix"),
              )}
              header={<Search variant="desktop" />}
            />
          ) : null}
          <MdxPageContent flexGrow={1} serializedPage={serializedPage} />
        </Box>
        <PageNavLinks
          prevPage={prevPage}
          nextPage={nextPage}
          sx={{
            marginLeft: {
              xs: 0,
              md: `${
                SIDEBAR_WIDTH + parseIntFromPixelString(theme.spacing(6))
              }px`,
            },
            maxWidth: {
              sx: "100%",
              sm: MDX_TEXT_CONTENT_MAX_WIDTH,
            },
            marginBottom: {
              xs: 8,
              md: 14,
            },
          }}
        />
      </Container>
    </>
  );
};

export default SpecPage;
