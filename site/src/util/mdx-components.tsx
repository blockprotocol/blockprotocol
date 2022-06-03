import { faLink } from "@fortawesome/free-solid-svg-icons";
import { Box, Paper, styled, Typography, TypographyProps } from "@mui/material";
import {
  ComponentType,
  HTMLAttributes,
  HTMLProps,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  VFC,
} from "react";
import slugify from "slugify";

import PageHeadingsContext from "../components/context/page-headings-context";
import { FontAwesomeIcon } from "../components/icons";
import { InfoCard } from "../components/info-card/info-card";
import { InfoCardWrapper } from "../components/info-card/info-card-wrapper";
import { Link } from "../components/link";
import { Snippet } from "../components/snippet";

const Heading = styled(Typography)(({ theme }) => ({
  "svg.link-icon": {
    transition: theme.transitions.create("opacity"),
    opacity: 0,
  },
  ":hover, a:focus-visible": {
    "svg.link-icon": {
      opacity: 1,
    },
  },
  "@media (hover: none)": {
    "svg.link-icon": {
      opacity: 1,
    },
  },
}));

const usePageHeading = (props: { anchor: string }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { headings, setHeadings } = useContext(PageHeadingsContext);

  const { anchor } = props;

  useEffect(() => {
    if (
      headingRef.current &&
      headings.find((heading) => heading.anchor === anchor) === undefined
    ) {
      const element = headingRef.current;
      setHeadings((prev) => [...prev, { anchor, element }]);
    }
  }, [anchor, headingRef, headings, setHeadings]);

  return { headingRef };
};

const HeadingAnchor: VFC<{ anchor: string; depth: 1 | 2 | 3 }> = ({
  depth,
  anchor,
}) => {
  const size = depth === 1 ? 28 : depth === 2 ? 24 : 20;
  return (
    <Link
      href={`#${anchor}`}
      sx={{
        display: "inline-block",
        verticalAlign: "middle",
        position: "relative",
        marginLeft: 2,
        height: size,
        width: size,
      }}
    >
      <FontAwesomeIcon
        icon={faLink}
        className="link-icon"
        sx={{
          fontSize: size,
          position: "absolute",
          lineHeight: size,
        }}
      />
    </Link>
  );
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

const HEADING_MARGIN_TOP = {
  H1: 8,
  H2: 8,
  H3: 6,
  H4: 6,
};
const HEADING_MARGIN_BOTTOM = 2;

export const mdxComponents: Record<string, ComponentType> = {
  Box,
  Paper,
  Typography,
  InfoCardWrapper,
  InfoCard,
  h1: (props: TypographyProps) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { headingRef } = usePageHeading({ anchor: "" });
    return (
      <Heading
        ref={headingRef}
        mt={HEADING_MARGIN_TOP.H1}
        mb={HEADING_MARGIN_BOTTOM}
        variant="bpHeading1"
        {...props}
      >
        {props.children}
        <HeadingAnchor anchor="" depth={1} />
      </Heading>
    );
  },
  h2: (props: TypographyProps) => {
    const anchor = slugify(stringifyChildren(props.children), {
      lower: true,
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { headingRef } = usePageHeading({ anchor });

    return (
      <Heading
        ref={headingRef}
        mt={HEADING_MARGIN_TOP.H2}
        mb={HEADING_MARGIN_BOTTOM}
        variant="bpHeading2"
        {...props}
      >
        {props.children}
        <HeadingAnchor anchor={anchor} depth={2} />
      </Heading>
    );
  },
  h3: (props: TypographyProps) => {
    const anchor = slugify(stringifyChildren(props.children), {
      lower: true,
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { headingRef } = usePageHeading({ anchor });

    return (
      <Heading
        ref={headingRef}
        mt={HEADING_MARGIN_TOP.H3}
        mb={HEADING_MARGIN_BOTTOM}
        variant="bpHeading3"
        {...props}
      >
        {props.children}
        <HeadingAnchor anchor={anchor} depth={3} />
      </Heading>
    );
  },
  h4: (props: TypographyProps) => (
    <Heading
      mt={HEADING_MARGIN_TOP.H4}
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
        sx={({ palette }) => ({
          marginBottom: 3,
          padding: {
            xs: 2,
            sm: 3,
          },
          a: {
            color: palette.teal[600],
            borderColor: palette.teal[600],
            ":hover": {
              color: palette.teal[700],
              borderColor: palette.teal[700],
            },
            ":focus-visible": {
              outlineColor: palette.teal[600],
            },
          },
          code: {
            color: palette.teal[700],
            background: palette.teal[200],
            borderColor: palette.teal[300],
          },
        })}
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
    return props.children as ReactElement;
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
          overflow: "auto",
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
