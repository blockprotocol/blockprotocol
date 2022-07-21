import { FunctionComponent, useEffect, useRef } from "react";

type HtmlBlockProps = {
  html: string;
  [key: string]: any;
};

/**
 * Creates an element from a given HTML string, including script tags.
 */
export const HtmlBlock: FunctionComponent<HtmlBlockProps> = ({
  html,
  ...props
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) {
      return;
    }

    // This approach means that any <script> tags in the HTML actually work.
    const docFragment = document.createRange().createContextualFragment(html);

    divRef.current.innerHTML = "";
    divRef.current.appendChild(docFragment);
  }, [html]);

  return <div ref={divRef} {...props} />;
};
