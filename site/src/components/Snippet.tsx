import React from "react";
import Prism from "prismjs";
import "prismjs/components/prism-json";

/**
 * Add support for another language:
 *
 * - add the language string id to the union type below
 * - import the grammar package from "prismjs/components/prism-[language]"
 * - eventually you may have to re-build and download the prism.css
 *   to support the new language at https://prismjs.com/download.html
 *   that file resides at src/styles/prism.css and has to be imported by
 *   nextjs' _app.tsx as per nextjs convention.
 *
 * @see https://prismjs.com
 */
type Language = "json";

interface SnippetProps {
  className?: string;
  source: string;
  language: Language;
}

export const Snippet: React.VFC<SnippetProps> = ({ className, source, language }) => (
  <pre className={className}>
    <code
      // eslint-disable-next-line react/no-danger -- trust prism to properly escape the source
      dangerouslySetInnerHTML={{
        __html: Prism.highlight(source, Prism.languages[language], language),
      }}
    />
  </pre>
);
