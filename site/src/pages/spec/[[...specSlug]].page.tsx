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
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { Button } from "../../components/Button";
import { Link } from "../../components/Link";
import { DESKTOP_NAVBAR_HEIGHT } from "../../components/Navbar";
import { PageStructure, Sidebar } from "../../components/PageSidebar";
import {
  getAllPageHrefs,
  getAllPageStructures,
  getSerializedPage,
} from "../../util/mdxUtils";
import { mdxComponents } from "../../util/mdxComponents";
import { parseIntFromPixelString } from "../../util/muiUtils";

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

type SpecPageProps = {
  serializedPage: MDXRemoteSerializeResult<Record<string, unknown>>;
  allPageStructures: PageStructure[];
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
    folderName: "spec",
    fileNameWithoutIndex,
  });

  return {
    props: {
      serializedPage,
      allPageStructures: getAllPageStructures({ folderName: "spec" }),
    },
    revalidate: true,
  };
};

const SpecPage: NextPage<SpecPageProps> = ({
  serializedPage,
  allPageStructures,
}) => {
  const theme = useTheme();

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
                parseIntFromPixelString(theme.spacing(2)),
            }}
          >
            <Sidebar
              pages={allPageStructures.filter(
                ({ title }) => !title.startsWith("Appendix"),
              )}
              appendices={allPageStructures.filter(({ title }) =>
                title.startsWith("Appendix"),
              )}
            />
          </Box>
        ) : null}
        <Box flexGrow={1}>
          <MDXRemote {...serializedPage} components={mdxComponents} />
        </Box>
      </Box>
    </Container>
  );
};

export default SpecPage;
