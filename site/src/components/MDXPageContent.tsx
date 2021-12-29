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
    sx={{
      width: "100%",
      overflow: "scroll",
      "& > :not(.info-card-wrapper), > a:not(.info-card-wrapper) > *": {
        maxWidth: {
          xs: "100%",
          sm: "62ch",
        },
      },
    }}
  >
    <MDXRemote {...serializedPage} components={mdxComponents} />
  </Box>
);
