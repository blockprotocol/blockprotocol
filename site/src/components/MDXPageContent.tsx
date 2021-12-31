import { VFC } from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Box, { BoxProps } from "@mui/material/Box";
import { mdxComponents } from "../util/mdxComponents";

export const MDX_TEXT_CONTENT_MAX_WIDTH = 680;

type MDXPageContentProps = {
  serializedPage: MDXRemoteSerializeResult<Record<string, unknown>>;
} & BoxProps;

export const MDXPageContent: VFC<MDXPageContentProps> = ({
  serializedPage,
  ...boxProps
}) => (
  <Box
    {...boxProps}
    sx={{
      width: "100%",
      overflow: "scroll",
      "& > :not(.info-card-wrapper), > a:not(.info-card-wrapper) > *": {
        maxWidth: {
          xs: "100%",
          sm: MDX_TEXT_CONTENT_MAX_WIDTH,
        },
      },
    }}
  >
    <MDXRemote {...serializedPage} components={mdxComponents} />
  </Box>
);
