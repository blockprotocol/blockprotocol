import { BlockMetadata } from "blockprotocol";
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

export const SandboxedBlock: VoidFunctionComponent<SandboxedBlockProps> = ({
  metadata,
  stringifiedSource,
  blockProps,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const reactVersion = "17.0.2";
  const mockBlockDockVersion = "0.0.9";

  const externalUrlLookup = useMemo(() => {
    const result: Record<string, string> = {};

    const externals = metadata.externals ?? {
      react: "17.0.2",
      lodash: "4.17.21",
      twind: "0.16.16",
    };

    for (const [packageName, packageVersion] of Object.entries(externals)) {
      const fixedPackageName =
        packageName === "lodash" ? "lodash-es" : packageName;
      result[
        packageName
      ] = `https://esm.sh/${fixedPackageName}@${packageVersion}`;
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

      const packageSourceLookup = {
        "block": ${JSON.stringify(stringifiedSource)},
      }

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
        if (packageName === "lodash") {
          console.log("require", packageName, requireLookup)
        }
        return requireLookup[packageName];
      };

      for (const [packageName, packageSource] of Object.entries(packageSourceLookup)) {
        const module = { exports: {} };
        const moduleFactory = new Function("require", "module", "exports", packageSource);
        moduleFactory(require, module, module.exports);
        requireLookup[packageName] = module.exports;
      }

      const findComponentExport = (module) => {
        return module.default ?? module.App ?? module[Object.keys(module)[0]];
      }

      const BlockComponent = findComponentExport(requireLookup["block"]);
      const render = (blockComponentProps) => ReactDOM.render(_jsx(MockBlockDock, { children: _jsx(BlockComponent, blockComponentProps) }), document.getElementById("container"));
      render(globalThis.initialBlockProps)
      window.addEventListener("message", ({ data }) => render(JSON.parse(data)), false);
    </script>
    <div id="container"></div>
  `,
    [externalUrlLookup, stringifiedSource],
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
