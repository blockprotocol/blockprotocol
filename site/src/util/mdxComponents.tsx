import slugify from "slugify";
import { HTMLAttributes, HTMLProps, ReactNode } from "react";
import { TypographyProps, Typography, Box, Paper } from "@mui/material";
import { Link } from "../components/Link";
import { InfoCardWrapper } from "../components/InfoCard/InfoCardWrapper";
import { InfoCard } from "../components/InfoCard/InfoCard";

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

export const mdxComponents: Record<string, React.ReactNode> = {
  Box,
  Paper,
  Typography,
  InfoCardWrapper,
  InfoCard,
  SomethingToThinkAbout: ({ children }: { children: ReactNode }) => {
    return (
      <div
        style={{
          border: "1px solid black",
          margin: "10px -15px",
          padding: "0 15px",
        }}
      >
        <div style={{ fontSize: "3em", textAlign: "center" }}>🤔</div>
        {children}
      </div>
    );
  },
  h1: (props: TypographyProps) => {
    return (
      <Link href="#">
        <Typography mb={3} id="" variant="bpHeading1" {...props} />
      </Link>
    );
  },
  h2: (props: TypographyProps) => {
    const anchor = slugify(stringifyChildren(props.children), {
      lower: true,
    });
    return (
      <Link href={`#${anchor}`}>
        <Typography mb={3} id={anchor} variant="bpHeading2" {...props} />
      </Link>
    );
  },
  h3: (props: TypographyProps) => {
    const anchor = slugify(stringifyChildren(props.children), {
      lower: true,
    });
    return (
      <Link href={`#${anchor}`}>
        <Typography id={anchor} variant="bpHeading3" {...props} />
      </Link>
    );
  },
  h4: (props: TypographyProps) => (
    <Typography variant="bpHeading4" {...props} />
  ),
  p: (props: TypographyProps) => (
    <Typography mb={2} variant="bpBodyCopy" {...props} />
  ),
  a: (props: HTMLProps<HTMLAnchorElement>) => {
    const { href, ref, ...rest } = props;
    void ref;
    return href ? (
      <Link {...rest} href={href} />
    ) : (
      // eslint-disable-next-line jsx-a11y/anchor-has-content -- special case for creating bookmarks (for cross-linking)
      <a id={props.id} />
    );
  },

  // TODO: Improve style & implementation of below components

  Frame: ({ children, emoji }: { children?: ReactNode; emoji?: ReactNode }) => {
    return (
      <div
        style={{
          border: "1px solid black",
          margin: "10px -15px",
          padding: "0 15px",
        }}
      >
        <div style={{ fontSize: "3em", textAlign: "center" }}>{emoji}</div>
        {children}
      </div>
    );
  },
  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <ol style={{ margin: 20, listStyle: "auto" }} {...props} />
  ),
  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul style={{ margin: 20, listStyle: "unset" }} {...props} />
  ),
  inlineCode: (props: HTMLAttributes<HTMLElement>) => (
    <code
      {...props}
      // TODO: link to theme
      style={{ color: "#d18d5b", fontSize: "95%" }}
    />
  ),
  code: (props: HTMLAttributes<HTMLElement>) => {
    const isLanguageBlockMethod = props.className === "language-block-method";
    if (isLanguageBlockMethod) {
      const anchor = `${props.children}`.match(/^[\w]+/)?.[0] ?? "";
      return (
        <div id={anchor} style={{ fontWeight: "bold", color: "#d18d5b" }}>
          <Link href={`#${anchor}`}>{props.children}</Link>
        </div>
      );
    }

    return (
      <code
        {...props}
        // TODO: link to theme
        style={{
          color: "#d18d5b",
          fontSize: "95%",
          display: "block",
          paddingBottom: 20,
          textShadow: "none",
        }}
      />
    );
  },
};
