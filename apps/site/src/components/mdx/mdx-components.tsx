import { faLink } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Paper,
  styled,
  Typography,
  typographyClasses,
  TypographyProps,
} from "@mui/material";
import {
  Children,
  FunctionComponent,
  HTMLAttributes,
  HTMLProps,
  isValidElement,
  ReactNode,
} from "react";
import slugify from "slugify";

import { FontAwesomeIcon } from "../icons";
import { Link } from "../link";
import { Snippet } from "../snippet";
import { FAQ } from "./faq";
import { GitHubInfoCard } from "./info-card/github-info-card";
import { InfoCard } from "./info-card/info-card";
import { InfoCardWrapper } from "./info-card/info-card-wrapper";
import { GraphModuleMessageList } from "./modules/graph/graph-module-message-list";
import { DataTypeMetaSchema } from "./modules/graph/schemas/data-type";
import { EntityMetaSchema } from "./modules/graph/schemas/entity";
import { EntityTypeMetaSchema } from "./modules/graph/schemas/entity-type";
import { PropertyTypeMetaSchema } from "./modules/graph/schemas/property-type";
import { HookModuleMessageList } from "./modules/hook/hook-module-message-list";
import { ServiceModuleMessageList } from "./modules/service/service-module-message-list";
import { usePageHeading } from "./shared/use-page-heading";
import { stringifyChildren } from "./shared/util";

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

const HeadingAnchor: FunctionComponent<{
  anchor: string;
  depth: 1 | 2 | 3 | 4 | 5;
}> = ({ depth, anchor }) => {
  const size = depth === 1 ? 28 : depth === 2 ? 24 : depth === 3 ? 20 : 16;
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

const HEADING_MARGIN_TOP = {
  H1: 8,
  H2: 8,
  H3: 6,
  H4: 6,
  H5: 6,
  H6: 6,
};
const HEADING_MARGIN_BOTTOM = 2;

export const mdxComponents: Record<
  string,
  FunctionComponent<{ children?: ReactNode; [rest: string]: unknown }>
> = {
  Box,
  Paper,
  Typography,
  InfoCardWrapper,
  GitHubInfoCard,
  InfoCard,
  FAQ,
  GraphModuleMessageList,
  HookModuleMessageList,
  ServiceModuleMessageList,
  DataTypeMetaSchema,
  PropertyTypeMetaSchema,
  EntityTypeMetaSchema,
  EntityMetaSchema,
  SubTitle: (({ children }: { children?: ReactNode }) => (
    <Box
      maxWidth={750}
      sx={{
        marginBottom: 6,
        // override the styling of any nested typography component
        [`> .${typographyClasses.root}`]: ({ typography }) =>
          typography.bpSubtitle,
      }}
    >
      {children}
    </Box>
  )) as FunctionComponent,
  Hidden: (({ children }: { children?: ReactNode }) => {
    return (
      <span aria-hidden style={{ display: "none" }}>
        {children}
      </span>
    );
  }) as FunctionComponent,
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
  h4: (props: TypographyProps) => {
    return (
      <Heading
        mt={HEADING_MARGIN_TOP.H4}
        mb={HEADING_MARGIN_BOTTOM}
        variant="bpHeading4"
        {...props}
      />
    );
  },
  h5: (props: TypographyProps) => {
    return (
      <Heading
        mt={HEADING_MARGIN_TOP.H5}
        mb={HEADING_MARGIN_BOTTOM}
        variant="bpHeading5"
        {...props}
      />
    );
  },
  h6: (props: TypographyProps) => {
    return (
      <Heading
        mt={HEADING_MARGIN_TOP.H6}
        mb={HEADING_MARGIN_BOTTOM}
        variant="bpHeading6"
        {...props}
      />
    );
  },
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
      sx={{
        overflow: "auto",
        maxWidth: "100%",
      }}
    >
      <Box
        component="table"
        sx={{
          "td, th": {
            border: ({ palette }) => `1px solid ${palette.gray[30]}`,
            paddingY: 1,
            paddingX: 3,
            typography: "bpSmallCopy",
          },
          th: {
            backgroundColor: ({ palette }) => palette.gray[10],
          },
          marginBottom: 2,
        }}
        {...props}
      >
        {children}
      </Box>
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
        listStyle: "initial",
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
  // inline code (`)
  code: (props: HTMLAttributes<HTMLElement>) => (
    <Typography
      variant="bpCode"
      sx={{
        fontSize: "80%",
        wordBreak: "break-word",
      }}
      {...props}
    />
  ),
  // block code (```) - consists of <pre><code>...</code></pre>
  pre: ({ children, ...rest }: HTMLAttributes<HTMLElement>) => {
    const [child, ...otherChildren] = Children.toArray(children);
    if (
      isValidElement(child) &&
      child.type === mdxComponents.code &&
      !otherChildren.length
    ) {
      const childProps = child.props as {
        className?: string;
        children?: React.ReactNode;
      };
      const isLanguageBlockFunction =
        childProps.className === "language-block-function";

      if (isLanguageBlockFunction) {
        const anchor = `${childProps.children}`.match(/^[\w]+/)?.[0] ?? "";
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
            <Link href={`#${anchor}`}>{childProps.children}</Link>
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
            source={`${childProps.children}`}
            language={childProps.className?.replace("language-", "") ?? ""}
          />
        </Box>
      );
    }

    // fallback
    return <pre {...rest}>{children}</pre>;
  },
};
