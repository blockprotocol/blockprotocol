import React from "react";
import Prism from "prismjs";

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

import "prismjs/components/prism-json";
import "prismjs/components/prism-json5";

interface SnippetProps {
  className?: string;
  source: string;
  language: string;
}

export const Snippet: React.VFC<SnippetProps> = ({
  className,
  source,
  language,
}) => {
  const grammar = Prism.languages[language];
  if (!grammar) {
    return <code className={className}>{source}</code>;
  }

  return (
    <code
      className={className}
      // eslint-disable-next-line react/no-danger -- trust prism to properly escape the source
      dangerouslySetInnerHTML={{
        __html: Prism.highlight(source, grammar, language),
      }}
    />
  );
};
