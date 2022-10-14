/* eslint-disable import/no-duplicates -- import "prismjs" has a side-effect so needs to be listed before "prismjs/components/*"  */
/**
 * Add support for another language:
 *
 * - import the grammar package from "prismjs/components/prism-[language]"
 * - eventually you may have to re-build and download the prism.css
 *   to support the new language at https://prismjs.com/download.html
 *   that file resides at src/styles/prism.css and has to be imported by
 *   nextjs' _app.tsx as per nextjs convention.
 *
 * @see https://prismjs.com
 */
import "prismjs";
import "prismjs/components/prism-json";
import "prismjs/components/prism-json5";

import { Box, BoxProps } from "@mui/material";
import Prism from "prismjs";
import { FunctionComponent } from "react";

import { CODE_FONT_FAMILY } from "../theme/typography";

type SnippetProps = {
  source: string;
  language: string;
} & BoxProps;

export const Snippet: FunctionComponent<SnippetProps> = ({
  source,
  language,
  sx = [],
  ...boxProps
}) => {
  const mergedSx: BoxProps["sx"] = [
    { fontFamily: CODE_FONT_FAMILY },
    ...(Array.isArray(sx) ? sx : [sx]),
  ];

  const grammar = Prism.languages[language];
  if (!grammar) {
    return (
      <Box component="code" sx={mergedSx} {...boxProps}>
        {source}
      </Box>
    );
  }

  return (
    <Box
      component="code"
      sx={mergedSx}
      {...boxProps}
      // trust prism to properly escape the source
      dangerouslySetInnerHTML={{
        __html: Prism.highlight(source, grammar, language),
      }}
    />
  );
};
