import { parse as parseModules } from "es-module-lexer";
import { v4 as uuid } from "uuid";

import { HtmlBlockDefinition } from "./types";

type ScriptRef = { src: string };

type BlockIdentifier =
  | string
  | { blockId: string }
  | ScriptRef
  | null
  | undefined;

let blocks = new Map<string, { container: HTMLElement; url: string }>();
let scripts = new WeakMap<ScriptRef, string>();

const getIdForScriptRef = (ref: ScriptRef) => {
  if (scripts.has(ref)) {
    return scripts.get(ref)!;
  }

  return new URL(ref.src).searchParams.get("blockId");
};

const getOptionalIdForRef = (ref?: BlockIdentifier) => {
  if (ref) {
    if (typeof ref === "string") {
      return getIdForScriptRef({ src: ref });
    }

    if ("src" in ref) {
      return getIdForScriptRef(ref);
    }

    return ref.blockId;
  }
};

const getIdForRef = (ref?: BlockIdentifier) => {
  const id = getOptionalIdForRef(ref);

  if (!id) {
    throw new Error("Block script not setup properly");
  }

  return id;
};

export const getBlockContainer = (ref?: BlockIdentifier) => {
  const blockId = getIdForRef(ref);
  const container = blocks.get(blockId)?.container;

  if (!container) {
    throw new Error("Cannot find block container");
  }

  return container;
};

export const getBlockUrl = (ref?: BlockIdentifier) => {
  const blockId = getIdForRef(ref);
  const url = blocks.get(blockId)?.url;

  if (!url) {
    throw new Error("Cannot find block url");
  }

  return url;
};

export const markScript = (script: HTMLScriptElement, ref: BlockIdentifier) => {
  const blockId = getIdForRef(ref);

  if (script.type === "module") {
    if (script.src) {
      const url = new URL(script.src);
      url.searchParams.set("blockId", blockId);
      // eslint-disable-next-line no-param-reassign
      script.src = url.toString();
    } else {
      // eslint-disable-next-line no-param-reassign
      script.innerHTML = `
      const blockprotocol = {
        ...window.blockprotocol,
        getBlockContainer: () => window.blockprotocol.getBlockContainer({ blockId: "${blockId}" }),
        getBlockUrl: () => window.blockprotocol.getBlockUrl({ blockId: "${blockId}" }),
        markScript: (script) => window.blockprotocol.markScript(script, { blockId: "${blockId}" }),
      };

      ${script.innerHTML};
    `;
    }
  } else {
    scripts.set(script, blockId);
  }
};

const replaceBetween = (
  origin: string,
  startIndex: number,
  endIndex: number,
  insertion: string,
) =>
  `${origin.substring(0, startIndex)}${insertion}${origin.substring(endIndex)}`;

export const markBlockScripts = (container: HTMLElement, url: URL | string) => {
  const blockId = uuid();

  blocks.set(blockId, { container, url: url.toString() });

  for (const script of Array.from(container.querySelectorAll("script"))) {
    const src = script.getAttribute("src");
    if (src) {
      const resolvedSrc = new URL(src, url).toString();

      if (resolvedSrc !== script.src) {
        script.src = resolvedSrc;
      }
    }

    markScript(script, { blockId });

    const html = script.innerHTML;
    if (html) {
      const [imports] = parseModules(html);

      const relevantImports = imports.filter(
        (imp) => !(imp.d > -1) && imp.n?.startsWith("."),
      );

      script.innerHTML = relevantImports.reduce((prevSource, imp, idx) => {
        let nextSource = prevSource;

        nextSource += html.substring(
          idx === 0 ? 0 : relevantImports[idx - 1].se,
          imp.ss,
        );

        const statement = html.substring(imp.ss, imp.se);
        const specifierStart = imp.s - imp.ss;
        const specifierEnd = imp.e - imp.ss;

        nextSource += replaceBetween(
          statement,
          specifierStart,
          specifierEnd,
          new URL(imp.n!, url).toString(),
        );

        if (idx === relevantImports.length - 1) {
          nextSource += html.substring(imp.se);
        }

        return nextSource;
      }, "");
    }
  }
};

export const renderHtmlBlock = async (
  node: HTMLElement,
  definition: HtmlBlockDefinition,
  signal?: AbortSignal,
) => {
  const baseUrl = new URL(
    definition.url ?? window.location.toString(),
    window.location.toString(),
  );

  const htmlString =
    "source" in definition && definition.source
      ? definition.source
      : await fetch(definition.url, { signal }).then((resp) => resp.text());

  const range = document.createRange();

  range.selectNodeContents(node);

  const frag = range.createContextualFragment(htmlString);
  const parent = document.createElement("div");
  parent.append(frag);

  markBlockScripts(parent, baseUrl);

  if (!window.blockprotocol) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    assignBlockProtocolGlobals();
  }

  node.appendChild(parent);
};

const blockProtocolGlobals = {
  getBlockContainer,
  getBlockUrl,
  markScript,
};

const resetBlocks = () => {
  blocks = new Map();
  scripts = new WeakMap();
};

export const teardownBlockProtocol = () => {
  if (!window.blockprotocol) {
    throw new Error("Block Protocol is not installed");
  }

  delete window.blockprotocol;
  resetBlocks();
};

declare global {
  interface Window {
    blockprotocol?: typeof blockProtocolGlobals;
  }
}

export const assignBlockProtocolGlobals = () => {
  if (typeof window === "undefined") {
    throw new Error(
      "Can only call assignBlockProtocolGlobals in browser environments",
    );
  }

  if (window.blockprotocol) {
    throw new Error("Block Protocol globals have already been assigned");
  }

  resetBlocks();
  window.blockprotocol = blockProtocolGlobals;
};
