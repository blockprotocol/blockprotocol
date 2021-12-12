import { Fragment } from "react";
import {
  Container,
  Typography,
  Box,
  Icon,
  Paper,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { Link } from "../../components/Link";
import { DESKTOP_NAVBAR_HEIGHT } from "../../components/Navbar";
import { Sidebar } from "../../components/PageSidebar";
import {
  SpecPageSubSection,
  SpecPageSection,
  SpecPage as SpecPageType,
  SPECIFICATION_PAGES,
} from "../../content/SpecificationPages";

const renderPageContent = (pageHref: string) => {
  const page = SPECIFICATION_PAGES.find(({ href }) => href === pageHref);

  if (!page) return null;

  const { Content, sections } = page;

  return (
    <>
      {Content ? <Content /> : null}
      {sections?.map(
        ({ anchor: sectionAnchor, Content: SectionContent, subSections }) => (
          <Fragment key={sectionAnchor}>
            {SectionContent ? <SectionContent /> : null}
            {subSections &&
              subSections.map(
                ({ anchor: subSectionAnchor, Content: SubSectionContent }) => (
                  <SubSectionContent key={subSectionAnchor} />
                ),
              )}
          </Fragment>
        ),
      )}
    </>
  );
};

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
        sx={{
          color: ({ palette }) => palette.teal[600],
          fontSize: 15,
          lineHeight: 1.5,
        }}
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
      <Button
        variant="primary"
        color="teal"
        startIcon={<Icon className="fab fa-github" />}
        sx={{
          textTransform: "none",
        }}
      >
        <Typography>View the spec on Github</Typography>
      </Button>
    </Box>
  </Paper>
);

type SpecPageWithoutContent = Omit<SpecPageType, "Content" | "sections"> & {
  Content: null;
  sections:
    | (Omit<SpecPageSection, "Content" | "subSections"> & {
        Content: null;
        subSections:
          | (Omit<SpecPageSubSection, "Content"> & {
              Content: null;
            })[]
          | null;
      })[]
    | null;
};

const mapSpecPageToSpecPageWithoutContent = (
  page: SpecPageType,
): SpecPageWithoutContent => ({
  ...page,
  Content: null,
  sections:
    page.sections?.map((section) => ({
      ...section,
      Content: null,
      subSections:
        section.subSections?.map((subSection) => ({
          ...subSection,
          Content: null,
        })) || null,
    })) || null,
});

type SpecPageProps = {
  page: SpecPageWithoutContent;
};

type SpecPageQueryParams = {
  specSlug?: string[];
};

export const getStaticPaths: GetStaticPaths<SpecPageQueryParams> = async () => {
  const paths = SPECIFICATION_PAGES.map(({ href }) => ({
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

  const page =
    specSlug && specSlug.length > 0
      ? SPECIFICATION_PAGES.find(
          ({ href }) => href === `/spec/${specSlug.join("/")}`,
        )
      : SPECIFICATION_PAGES.find(({ href }) => href === "/spec");

  if (!page) {
    throw new Error("");
  }

  return {
    props: {
      page: mapSpecPageToSpecPageWithoutContent(page),
    },
    revalidate: true,
  };
};

const SpecPage: NextPage<SpecPageProps> = ({ page }) => {
  const theme = useTheme();

  const md = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Container>
      <Typography
        variant="bpHeading1"
        sx={{ color: ({ palette }) => palette.common.black }}
      >
        Specification
      </Typography>
      <Typography
        variant="bpHeading2"
        maxWidth={750}
        sx={{
          fontWeight: 100,
          marginBottom: {
            xs: 4,
            md: 6,
          },
        }}
      >
        The open-source protocol for creating interactive, data-driven blocks
      </Typography>
      {GitHubInfoCard}
      <Box py={4} display="flex" alignItems="flex-start">
        {md ? (
          <Box
            paddingRight={4}
            width={300}
            flexGrow={0}
            sx={{
              position: "sticky",
              top:
                DESKTOP_NAVBAR_HEIGHT +
                parseInt(theme.spacing(2).slice(0, -2), 10),
            }}
          >
            <Sidebar
              pages={SPECIFICATION_PAGES.filter(
                ({ isAppendix }) => !isAppendix,
              )}
              appendices={SPECIFICATION_PAGES.filter(
                ({ isAppendix }) => isAppendix,
              )}
            />
          </Box>
        ) : null}
        <Box flexGrow={1}>{renderPageContent(page.href)}</Box>
      </Box>
    </Container>
  );
};

export default SpecPage;
