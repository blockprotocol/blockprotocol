import { useContext } from "react";
import {
  Container,
  Typography,
  Box,
  Icon,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { Button } from "../../components/Button";
import { Link } from "../../components/Link";
import { DESKTOP_NAVBAR_HEIGHT } from "../../components/Navbar";
import { Sidebar } from "../../components/PageSidebar";
import { getAllPageHrefs, getSerializedPage } from "../../util/mdxUtils";
import { parseIntFromPixelString } from "../../util/muiUtils";
import SiteMapContext from "../../components/context/SiteMapContext";
import { MDXPageContent } from "../../components/MDXPageContent";
import { INFO_CARD_WIDTH } from "../../components/InfoCard/InfoCardWrapper";
import { PageNavLinks } from "../../components/PageNavLinks";

const GitHubInfoCard = (
  <Paper
    variant="teal"
    sx={{
      padding: {
        xs: 2,
        sm: 3,
      },
      display: "flex",
      alignItems: "stretch",
      flexDirection: {
        xs: "column",
        md: "row",
      },
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
      <Icon
        sx={{
          color: ({ palette }) => palette.teal[600],
          fontSize: 18,
        }}
        fontSize="inherit"
        className="fas fa-exclamation-triangle"
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
          "& a": {
            ":hover": {
              color: theme.palette.teal[700],
            },
          },
        })}
        maxWidth={650}
      >
        This specification is currently in progress. We’ve drafting it in public
        to gather feedback and improve the final document. If you have any
        suggestions or improvements you would like to add, feel free to submit a
        PR on{" "}
        <Link href="https://github.com/blockprotocol/blockprotocol">
          our Github repo
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
      <Link href="https://github.com/blockprotocol/blockprotocol/tree/main/site/src/_pages/spec">
        <Button
          variant="primary"
          color="teal"
          size="small"
          startIcon={<Icon className="fab fa-github" />}
          sx={{
            textTransform: "none",
          }}
        >
          View the spec on Github
        </Button>
      </Link>
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
    specSlug && specSlug.length > 0 ? specSlug[0] : "index";

  const serializedPage = await getSerializedPage({
    pathToDirectory: "spec",
    fileNameWithoutIndex,
  });

  return {
    props: {
      serializedPage,
    },
  };
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
    <Container
      sx={{
        marginTop: {
          xs: 4,
          md: 8,
        },
      }}
    >
      <Typography
        variant="bpTitle"
        sx={{
          marginBottom: {
            xs: 1,
            md: 2,
          },
        }}
      >
        Specification
      </Typography>
      <Typography
        variant="bpSubtitle"
        maxWidth={750}
        sx={{
          marginBottom: {
            xs: 4,
            md: 6,
          },
        }}
      >
        The open-source protocol for creating interactive, data-driven blocks
      </Typography>
      {GitHubInfoCard}
      <Box mb={4} py={4} display="flex" alignItems="flex-start">
        {md ? (
          <Box
            paddingRight={6}
            width={300}
            flexGrow={0}
            sx={{
              position: "sticky",
              top:
                DESKTOP_NAVBAR_HEIGHT +
                parseIntFromPixelString(theme.spacing(2)),
            }}
          >
            <Sidebar
              pages={specificationPages.filter(
                ({ title }) => !title.startsWith("Appendix"),
              )}
              appendices={specificationPages.filter(({ title }) =>
                title.startsWith("Appendix"),
              )}
            />
          </Box>
        ) : null}
        <MDXPageContent flexGrow={1} serializedPage={serializedPage} />
      </Box>
      <PageNavLinks
        prevPage={prevPage}
        nextPage={nextPage}
        mb={8}
        sx={{
          marginLeft: {
            xs: 0,
            md: "300px",
          },
          maxWidth: {
            xs: "100%",
            sm: `calc(100% - ${INFO_CARD_WIDTH}px)`,
            md: `calc(100% - ${INFO_CARD_WIDTH}px - 300px)`,
          },
        }}
      />
    </Container>
  );
};

export default SpecPage;
