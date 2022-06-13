import {
  assignBlockprotocolGlobals,
  blockprotocolGlobals,
  teardownBlockprotocol,
} from "@blockprotocol/core";
import React, { useLayoutEffect, useRef, VFC } from "react";

type HtmlElementLoaderProps = {
  htmlString: string;
};

export const HtmlLoader: VFC<HtmlElementLoaderProps> = ({ htmlString }) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    assignBlockprotocolGlobals();

    const node = ref.current;

    if (node) {
      const frag = document.createRange().createContextualFragment(htmlString);
      const parent = document.createElement("div");
      parent.append(frag);

      blockprotocolGlobals.markBlockScripts(parent);

      node.appendChild(parent);
      return () => {
        teardownBlockprotocol();
        node.innerHTML = "";
      };
    }
  }, [htmlString]);

  return <div ref={ref} />;
};
