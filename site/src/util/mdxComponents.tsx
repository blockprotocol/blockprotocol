/* eslint-disable react-hooks/rules-of-hooks */
import slugify from "slugify";
import {
  HTMLAttributes,
  HTMLProps,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";
import { TypographyProps, Typography, Box, Paper } from "@mui/material";
import { Link } from "../components/Link";
import { InfoCardWrapper } from "../components/InfoCard/InfoCardWrapper";
import { InfoCard } from "../components/InfoCard/InfoCard";
import { Snippet } from "../components/Snippet";
import MDXPageContext from "../components/context/MDXPageContext";

const useMDXHeading = (props: { anchor: string }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { headings, setHeadings } = useContext(MDXPageContext);

  useEffect(() => {
    const { anchor } = props;
    if (
      headingRef.current &&
      headings.find((heading) => heading.anchor === anchor) === undefined
    ) {
      const element = headingRef.current;
      setHeadings((prev) => [...prev, { anchor, element }]);
    }
  }, [props, headingRef, headings, setHeadings]);

  return { headingRef };
};

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
    const { headingRef } = useMDXHeading({ anchor: "" });
    return (
      <Link
        href="#"
        sx={{
          "&:first-of-type": {
            "& > h1": {
              marginTop: 0,
            },
          },
        }}
      >
        <Typography
          ref={headingRef}
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
    const { headingRef } = useMDXHeading({ anchor });
    return (
      <Link
        href={`#${anchor}`}
        sx={{
          "&:first-of-type": {
            "& > h2": {
              marginTop: 0,
            },
          },
        }}
      >
        <Typography
          ref={headingRef}
          mt={HEADING_MARGIN_TOP}
          mb={HEADING_MARGIN_BOTTOM}
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
    const { headingRef } = useMDXHeading({ anchor });
    return (
      <Link href={`#${anchor}`}>
        <Typography
          ref={headingRef}
          mt={HEADING_MARGIN_TOP}
          mb={HEADING_MARGIN_BOTTOM}
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
      <Typography variant="bpBodyCopy" component="div">
        {props.children}
      </Typography>
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
