import slugify from "slugify";
import { HTMLAttributes, HTMLProps, ReactNode } from "react";
import { TypographyProps, Typography, Box, Paper } from "@mui/material";
import { Link } from "../components/Link";
import { InfoCardWrapper } from "../components/InfoCard/InfoCardWrapper";
import { InfoCard } from "../components/InfoCard/InfoCard";
import { Snippet } from "../components/Snippet";

const stringifyChildren = (node: ReactNode): string => {
  if (typeof node === "string") {
    return node;
  } else if (Array.isArray(node)) {
    return node.map(stringifyChildren).join("");
  } else if (!!node && typeof node === "object" && "props" in node) {
    return stringifyChildren(node.props.children);
  }
  return "";
};

const HEADING_MARGIN_TOP = 6;
const HEADING_MARGIN_BOTTOM = 2;

export const mdxComponents: Record<string, ReactNode> = {
  Box,
  Paper,
  Typography,
  InfoCardWrapper,
  InfoCard,
  h1: (props: TypographyProps) => {
    return (
      <Link
        href="#"
        sx={{
          "&:first-child": {
            "& > h1": {
              marginTop: 0,
            },
          },
        }}
      >
        <Typography
          mt={HEADING_MARGIN_TOP}
          mb={HEADING_MARGIN_BOTTOM}
          variant="bpHeading1"
          {...props}
        />
      </Link>
    );
  },
  h2: (props: TypographyProps) => {
    const anchor = slugify(stringifyChildren(props.children), {
      lower: true,
    });
    return (
      <Link
        href={`#${anchor}`}
        sx={{
          "&:first-child": {
            "& > h2": {
              marginTop: 0,
            },
          },
        }}
      >
        <Typography
          mt={HEADING_MARGIN_TOP}
          mb={HEADING_MARGIN_BOTTOM}
          id={anchor}
          variant="bpHeading2"
          {...props}
        />
      </Link>
    );
  },
  h3: (props: TypographyProps) => {
    const anchor = slugify(stringifyChildren(props.children), {
      lower: true,
    });
    return (
      <Link href={`#${anchor}`}>
        <Typography
          mt={HEADING_MARGIN_TOP}
          mb={HEADING_MARGIN_BOTTOM}
          id={anchor}
          variant="bpHeading3"
          {...props}
        />
      </Link>
    );
  },
  h4: (props: TypographyProps) => (
    <Typography
      mt={HEADING_MARGIN_TOP}
      mb={HEADING_MARGIN_BOTTOM}
      variant="bpHeading4"
      {...props}
    />
  ),
  p: (props: TypographyProps) => (
    <Typography mb={2} variant="bpBodyCopy" {...props} />
  ),
  a: (props: HTMLProps<HTMLAnchorElement>) => {
    const { href, ref: _ref, ...rest } = props;
    return href ? (
      <Link {...rest} href={href.replace("https://blockprotocol.org", "")} />
    ) : (
      // eslint-disable-next-line jsx-a11y/anchor-has-content -- special case for creating bookmarks (for cross-linking)
      <a id={props.id} />
    );
  },
  table: ({ children, ref: _ref, ...props }: HTMLProps<HTMLTableElement>) => (
    <Box
      component="table"
      sx={{
        "td, th": {
          border: ({ palette }) => `1px solid ${palette.gray[30]}`,
          paddingY: 1,
          paddingX: 3,
          typography: "bpSmallCopy",
        },
        marginBottom: 2,
      }}
      {...props}
    >
      {children}
    </Box>
  ),

  // TODO: Improve style & implementation of below components

  Frame: ({ children, emoji }: { children?: ReactNode; emoji?: ReactNode }) => {
    return (
      <Paper
        variant="teal"
        sx={{
          marginBottom: 3,
          padding: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        <Box sx={{ fontSize: "3em", textAlign: "center" }}>{emoji}</Box>
        {children}
      </Paper>
    );
  },
  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <Box
      component="ol"
      sx={(theme) => ({
        marginBottom: theme.spacing(2),
        paddingLeft: theme.spacing(4),
        listStyle: "auto",
      })}
      {...props}
    />
  ),
  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <Box
      component="ul"
      sx={(theme) => ({
        marginBottom: theme.spacing(2),
        paddingLeft: theme.spacing(4),
        listStyle: "unset",
      })}
      {...props}
    />
  ),
  li: (props: HTMLAttributes<HTMLLIElement>) => (
    <Box {...props} component="li">
      <Typography variant="bpBodyCopy">{props.children}</Typography>
    </Box>
  ),
  inlineCode: (props: HTMLAttributes<HTMLElement>) => (
    <Box
      component="code"
      sx={(theme) => ({
        fontSize: "80%",
        color: theme.palette.purple[700],
        background: theme.palette.purple[100],
        padding: theme.spacing(0.25, 0.5),
        borderColor: theme.palette.purple[200],
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: "4px",
      })}
      {...props}
    />
  ),
  pre: (props: HTMLAttributes<HTMLElement>) => {
    // Delegate full control to code for more styling options
    return props.children;
  },
  code: (props: HTMLAttributes<HTMLElement>) => {
    const isLanguageBlockFunction =
      props.className === "language-block-function";
    if (isLanguageBlockFunction) {
      const anchor = `${props.children}`.match(/^[\w]+/)?.[0] ?? "";
      return (
        <Box
          id={anchor}
          component="code"
          sx={{
            fontWeight: "bold",
            color: "#d18d5b",
            display: "block",
            marginTop: 4,
          }}
        >
          <Link href={`#${anchor}`}>{props.children}</Link>
        </Box>
      );
    }
    return (
      <Box
        component="pre"
        sx={(theme) => ({
          overflow: "scroll",
          display: "block",
          fontSize: "90%",
          color: theme.palette.purple[400],
          background: "#161a1f",
          padding: theme.spacing(3),
          borderWidth: 1,
          borderStyle: "solid",
          borderRadius: "8px",
          textShadow: "none",
          marginBottom: 2,
          maxWidth: "72ch",
        })}
      >
        <Snippet
          source={`${props.children}`}
          language={props.className?.replace("language-", "") ?? ""}
        />
      </Box>
    );
  },
};
