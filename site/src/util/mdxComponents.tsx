import slugify from "slugify";
import { ReactNode } from "react";
import { TypographyProps, Typography, Box, Paper } from "@mui/material";
import { Link, LinkProps } from "../components/Link";
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
  a: (props: LinkProps) => <Link {...props} />,
};
