import { v4 as uuid } from "uuid";

type ScriptRef = { src: string };

let blocks = new Map<string, HTMLElement>();
let scripts = new WeakMap<ScriptRef, string>();

export type BlockIdentifier =
  | string
  | { blockId: string }
  | ScriptRef
  | null
  | undefined;

export const getIdForScriptRef = (ref: ScriptRef) => {
  if (scripts.has(ref)) {
    return scripts.get(ref)!;
  }

  return new URL(ref.src).searchParams.get("blockId");
};

export const getOptionalIdForRef = (ref?: BlockIdentifier) => {
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

export const getIdForRef = (ref?: BlockIdentifier) => {
  const id = getOptionalIdForRef(ref);

  if (!id) {
    throw new Error("Block script not setup properly");
  }

  return id;
};

export const getBlockContainer = (ref?: BlockIdentifier) => {
  const blockId = getIdForRef(ref);
  const container = blocks.get(blockId);

  if (!container) {
    throw new Error("Cannot find element");
  }

  return container;
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
        markScript: (script) => window.blockprotocol.markScript(script, { blockId: "${blockId}" })
      };

      ${script.innerHTML};
    `;
    }
  } else {
    scripts.set(script, blockId);
  }
};

export const resetBlocks = () => {
  blocks = new Map();
  scripts = new WeakMap();
};

export const markBlockScripts = (block: HTMLElement) => {
  const blockId = uuid();

  blocks.set(blockId, block);

  for (const script of Array.from(block.querySelectorAll("script"))) {
    markScript(script, { blockId });
  }
};

export const blockprotocolGlobals = {
  getBlockContainer,
  markScript,
  markBlockScripts,
  getIdForRef,
};

export const teardownBlockprotocol = () => {
  delete window.blockprotocol;
  resetBlocks();
};

declare global {
  interface Window {
    blockprotocol?: typeof blockprotocolGlobals;
  }
}

export const assignBlockprotocolGlobals = () => {
  if (typeof window === "undefined") {
    throw new Error(
      "Can only call assignBlockProtocolGlobals in browser environments",
    );
  }

  window.blockprotocol = blockprotocolGlobals;
};
