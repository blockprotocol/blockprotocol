import { VFC } from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Box, { BoxProps } from "@mui/material/Box";
import { mdxComponents } from "../util/mdxComponents";
import { INFO_CARD_WIDTH } from "./InfoCard/InfoCardWrapper";

type MDXPageContentProps = {
  serializedPage: MDXRemoteSerializeResult<Record<string, unknown>>;
} & BoxProps;

export const MDXPageContent: VFC<MDXPageContentProps> = ({
  serializedPage,
  ...boxProps
}) => (
  <Box
    {...boxProps}
    sx={(theme) => ({
      width: "100%",
      overflow: "scroll",
      "& > :not(.info-card-wrapper), > a:not(.info-card-wrapper) > *": {
        maxWidth: {
          xs: "100%",
          sm: `calc(100% - ${INFO_CARD_WIDTH}px)`,
        },
      },
      '& pre:not([class*="language-"]) > code[class*="language-"]': {
        overflow: "scroll",
        display: "block",
        fontSize: "80%",
        color: theme.palette.purple[700],
        background: theme.palette.purple[100],
        padding: theme.spacing(2),
        borderColor: theme.palette.purple[200],
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: "8px",
        textShadow: "none",
      },
    })}
  >
    <MDXRemote {...serializedPage} components={mdxComponents} />
  </Box>
);
