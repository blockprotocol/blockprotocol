import { NextApiHandler } from "next";

import packageJson from "../../../../package.json";
import { getBlockByUserAndName } from "../../../lib/api/blocks/get.js";
import { retrieveBlockFileContent } from "../../../lib/blocks.js";

/**
 * @todo potentially remove after building blocks to ESM
 */
const hotfixPackageName = (packageName: string): string => {
  return packageName === "lodash" ? "lodash-es" : packageName;
};

const handler: NextApiHandler = async (req, res) => {
  if (req.url?.startsWith("/api/rewrites/")) {
    res.status(404).send("Not found");
    return;
  }

  if (req.headers.origin === "blockprotocol.org") {
    res.status(403).send("Forbidden");
    return;
  }

  const shortname = (req.query.shortname as string).replace(/^@/, "");

  const blockMetadata = await getBlockByUserAndName({
    shortname,
    name: req.query.blockslug as string,
  });

  if (!blockMetadata) {
    res.status(404);
    res.write("Block not found");
    res.end();
    return;
  }

  const { exampleGraph } = await retrieveBlockFileContent(blockMetadata);

  const mockBlockDockVersion = packageJson.dependencies["mock-block-dock"];

  const reactVersion =
    blockMetadata.externals?.react ?? packageJson.dependencies.react;

  const externalUrlLookup: Record<string, string> = {};

  const externals = blockMetadata.externals ?? {};
  if (
    Object.keys(externals).length > 0 &&
    blockMetadata.blockType.entryPoint === "html"
  ) {
    throw new Error(
      "Block Protocol does not support externals with HTML blocks",
    );
  }

  for (const [packageName, packageVersion] of Object.entries(externals)) {
    externalUrlLookup[packageName] = `https://esm.sh/${hotfixPackageName(
      packageName,
    )}@${packageVersion}?target=es2021`;
  }

  const mockBlockDockInitialData = {
    initialEntities: exampleGraph?.entities,
    initialEntityTypes: exampleGraph?.entityTypes,
    initialLinks: exampleGraph?.links,
    initialLinkedAggregations: exampleGraph?.linkedAggregations,
  };

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charSet="utf-8" />
    <script type="module">
      const handleMessage = ({ data }) => {
        if (typeof data !== "string") {
          return;
        }
        globalThis.blockEntityProps = JSON.parse(data);
        window.removeEventListener("message", handleMessage);
      }
      window.addEventListener("message", handleMessage);
    </script>
    <script type="module">
      import React from "https://esm.sh/react@${reactVersion}?target=es2021"
      import ReactDOM from "https://esm.sh/react-dom@${reactVersion}?target=es2021"
      import { jsx as _jsx } from "https://esm.sh/react@${reactVersion}/jsx-runtime.js?target=es2021";
      import { MockBlockDock } from "https://esm.sh/mock-block-dock@${mockBlockDockVersion}/dist/esm/index.js?target=es2021&deps=react@${reactVersion}";

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

      const findBlockExport = (module) => {
        const result = module.default ?? module.App ?? module[Object.keys(module)[0]];
        if (!result) {
          throw new Error("Could not find export from block source");
        }
        return result;
      }
      
      const blockType = ${JSON.stringify(blockMetadata.blockType)};
      
      const timeout = setTimeout(() => { 
        document.getElementById("loading-indicator").style.visibility = "visible";
      }, 400);
        
      fetch("${
        blockMetadata.source
      }").then((response) => response.text()).then(source => {
          clearTimeout(timeout);
      
          const entryPoint = blockType.entryPoint.toLocaleLowerCase();
          const blockExport = entryPoint === "html" ? source : findBlockExport(loadCjsFromSource(source));
          
          const blockDefinition = {
            ReactComponent: entryPoint === "react" ? blockExport : undefined,
            customElement: entryPoint === "custom-element" ? {
              elementClass: blockExport,
              tagName: blockType.tagName
            } : undefined,
            html: entryPoint === "html" ? {
              source: blockExport,
              url: "${blockMetadata.source}"
            } : undefined
          }
          
          const mockBlockDockInitialData = ${JSON.stringify(
            mockBlockDockInitialData,
          )}
      
          const render = (props) => {
            const { readonly, ...blockEntityProps } = props;
            const mockBlockDockProps = { blockDefinition, blockEntity: blockEntityProps, ...mockBlockDockInitialData, hideDebugToggle: true, readonly  };
            
            document.getElementById("loading-indicator")?.remove();
          
            ReactDOM.render(
              _jsx(MockBlockDock, mockBlockDockProps),
              document.getElementById("container")
            );
          }
          
          if (globalThis.blockEntityProps) {
            render(globalThis.blockEntityProps)
          }
          
          window.addEventListener(
              "message", 
              ({ data }) => { 
                if (typeof data === "string") { 
                  render(JSON.parse(data)) 
                }
              }
          );
      });
      </script>
    </head>
    <body style="margin: 0; padding: 0;">
      <div id="container">
        <img 
          alt="Loading block source..." 
          id="loading-indicator" 
          src="/assets/blocks-loading.gif" 
          style="visibility:hidden;height:42px;width:42px;"
        />
      </div>
    </body>
  </html>
  `;

  res.status(200);
  res.write(html);
  res.end();
};

export default handler;
