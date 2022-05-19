import { BlockMetadata, JSONObject } from "blockprotocol";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  VoidFunctionComponent,
} from "react";

export interface SandboxedBlockProps {
  metadata: BlockMetadata;
  stringifiedSource: string;
  blockProps: Record<string, unknown> | undefined;
}

/**
 * @todo remove after fixing
 * - https://blockprotocol.org/@jmackie/blocks/quote
 * - https://blockprotocol.org/@shinypb/blocks/emoji-trading-cards
 * - https://blockprotocol.org/@kickstartds/blocks/button
 */
const hotfixExternals = (externals: JSONObject | undefined): JSONObject => {
  return (
    externals ?? {
      react: "17.0.2",
      lodash: "4.17.21",
      twind: "0.16.16",
    }
  );
};

/**
 * @todo potentially remove after building blocks to ESM
 */
const hotfixPackageName = (packageName: string): string => {
  return packageName === "lodash" ? "lodash-es" : packageName;
};

export const SandboxedBlock: VoidFunctionComponent<SandboxedBlockProps> = ({
  metadata,
  stringifiedSource,
  blockProps,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const reactVersion = metadata.externals?.react ?? "17.0.2";
  const mockBlockDockVersion = "0.0.9";

  const externalUrlLookup = useMemo(() => {
    const result: Record<string, string> = {};

    const externals = hotfixExternals(metadata.externals);

    for (const [packageName, packageVersion] of Object.entries(externals)) {
      result[packageName] = `https://esm.sh/${hotfixPackageName(
        packageName,
      )}@${packageVersion}`;
    }

    return result;
  }, [metadata]);

  const srcDoc = useMemo(
    () => `
    <script type="module">
      const handleMessage = ({ data }) => {
        globalThis.initialBlockProps = JSON.parse(data);
        window.addEventListener("message", handleMessage);
      }
      window.addEventListener("message", handleMessage, false);
    </script>
    <script type="module">
      import React from "https://esm.sh/react@${reactVersion}"
      import ReactDOM from "https://esm.sh/react-dom@${reactVersion}"
      import { jsx as _jsx } from "https://esm.sh/react@${reactVersion}/jsx-runtime.js";
      import { MockBlockDock } from "https://esm.sh/mock-block-dock@${mockBlockDockVersion}?alias=lodash:lodash-es"

      const requireLookup = {
        "react-dom": ReactDOM,
        react: React,
        ${Object.entries(externalUrlLookup)
          .map(
            ([packageName, packageUrl]) =>
              `"${packageName}": await import("${packageUrl}")`,
          )
          .join(",")}
      }

      const require = (packageName) => {
        return requireLookup[packageName];
      };

      const loadCjsFromSource = (source) => {
        const module = { exports: {} };
        const moduleFactory = new Function("require", "module", "exports", source);
        moduleFactory(require, module, module.exports);

        return module.exports;
      }

      const findComponentExport = (module) => {
        return module.default ?? module.App ?? module[Object.keys(module)[0]];
      }

      const blockSource = ${JSON.stringify(stringifiedSource)};
      const BlockComponent = findComponentExport(loadCjsFromSource(blockSource));
      const render = (blockComponentProps) => {
        ReactDOM.render(
          _jsx(MockBlockDock, { children: _jsx(BlockComponent, blockComponentProps) }),
          document.getElementById("container")
        );
      }

      if (globalThis.initialBlockProps) {
        render(globalThis.initialBlockProps)
      }
      window.addEventListener("message", ({ data }) => render(JSON.parse(data)), false);
    </script>
    <div id="container"></div>
  `,
    [externalUrlLookup, reactVersion, stringifiedSource],
  );

  const postBlockProps = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify(blockProps),
      "*",
    );
  }, [blockProps]);

  useEffect(() => {
    postBlockProps();
  }, [postBlockProps]);

  return (
    <iframe
      ref={iframeRef}
      title="block"
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      onLoad={() => {
        postBlockProps();
      }}
      // todo: remove 100% after implementing viewport negotiation
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
};
