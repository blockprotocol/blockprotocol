import { parse as parseModules } from "es-module-lexer";
import { v4 as uuid } from "uuid";

export type HtmlBlockDefinition = {
  /**
   * The url to the block's HTML file entry point, e.g. `https://example.com/my-block.html`
   * The path is used as the base to resolve relative URLs in scripts/imports, and
   * is made available to blocks through `blockprotocol.getBlockUrl`. It is also
   * used by `renderHtmlBlock` to fetch the block's HTML source (the entry point),
   * if this is not provided.
   */
  url: string;
  /**
   * An HTML string equivalent to the file hosted at `url`.
   * If `source` is provided, `renderHtmlBlock` doesn't need to fetch the HTML
   * source, which can save time if you already have it available. `url` will
   * still be used to resolve relative URLs inside scripts.
   */
  source?: string;
};

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

/**
 * Retrieve the HTML containing node the block is being rendered within, which
 * can be used by a block to identify itself on the page and apply dynamic
 * behaviours to its elements.
 * @param ref Used to identify the block on the page. Usually `import.meta.url`
 *            or `document.currentScript` depending on if executing a module or
 *            a script. Should be omitted for inline modules
 *            (`<script type="module">...</script>`)
 */
export const getBlockContainer = (ref?: BlockIdentifier) => {
  const blockId = getIdForRef(ref);
  const container = blocks.get(blockId)?.container;

  if (!container) {
    throw new Error("Cannot find block container");
  }

  return container;
};

/**
 * Retrieve the URL for the HTML entry point, in order to resolve relative
 * URLs to assets within the block.
 * @param ref Used to identify the block on the page. Usually `import.meta.url`
 *            or `document.currentScript` depending on if executing a module or
 *            a script. Should be omitted for inline modules
 *            (`<script type="module">...</script>`)
 */
export const getBlockUrl = (ref?: BlockIdentifier) => {
  const blockId = getIdForRef(ref);
  const url = blocks.get(blockId)?.url;

  if (!url) {
    throw new Error("Cannot find block url");
  }

  return url;
};

/**
 * Used to mark dynamically inserted script tags as belonging to a certain block,
 * identified by `ref`.
 * @param script The script you want to mark as belonging to a block
 * @param ref Used to identify the block on the page. Usually `import.meta.url`
 *            or `document.currentScript` depending on if executing a module or
 *            a script. Should be omitted for inline modules
 *            (`<script type="module">...</script>`)
 */
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

/**
 * Used to mark all the scripts within a block's containing node as belonging
 * to that block. It should only be used once per block. It will also resolve
 * any relative URLs in import statements for inline scripts, and in the src
 * parameter.
 * @param container The containing node the block is being rendered into
 * @param url The HTML entry point for the block
 */
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
          idx === 0 ? 0 : relevantImports[idx - 1]!.se,
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

/**
 * Render an HTML block into a specified target node.
 * @param node The containing node to render the HTML block into
 * @param definition The description of where to find the HTML block
 * @param signal Used to abort the fetch of a block
 */
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

  if (!window.blockprotocol) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    assignBlockProtocolGlobals();
  }

  markBlockScripts(parent, baseUrl);

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

/**
 * Reset the global state and forget any registered blocks. Useful when about
 * to change page in a single page app.
 */
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

/**
 * Assign the required blockprotocol APIs for HTML blocks to the global context.
 */
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
