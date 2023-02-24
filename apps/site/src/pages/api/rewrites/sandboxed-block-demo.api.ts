import { QueryTemporalAxes } from "@blockprotocol/graph/temporal";
import { NextApiHandler } from "next";

import packageJson from "../../../../package.json";
import { getBlockByUserAndName } from "../../../lib/api/blocks/get";
import { retrieveBlockFileContent } from "../../../lib/blocks";

/**
 * @todo potentially remove after building blocks to ESM
 */
const hotfixPackageName = (packageName: string): string => {
  return packageName === "lodash" ? "lodash-es" : packageName;
};

const currentTime = new Date().toISOString();

const temporalAxes: QueryTemporalAxes = {
  pinned: {
    axis: "transactionTime",
    timestamp: currentTime,
  },
  variable: {
    axis: "decisionTime",
    interval: {
      start: { kind: "unbounded" },
      end: { kind: "inclusive", limit: currentTime },
    },
  },
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

  // @todo restore this when esm.sh treats version ranges correctly
  //    it currently pulls non-latest versions of packages if a range is supplied
  // const reactVersion =
  //   blockMetadata.externals?.react ?? packageJson.dependencies.react;

  const reactVersion = packageJson.dependencies.react;

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
    if (packageName === "react" || packageName === "react-dom") {
      // we already handled loading React in the HTML
      continue;
    }
    externalUrlLookup[packageName] = `https://esm.sh/${hotfixPackageName(
      packageName,
    )}@${packageVersion}?target=es2021`;
  }

  // The initial datastore is set from a static file, example-graph.json
  // We will dynamically update initialEntities in response to updated prop messages in the iFrame code
  const mockBlockDockInitialData = {
    initialEntities: exampleGraph?.entities ?? [],
    initialEntityTypes: exampleGraph?.entityTypes,
    initialLinks: exampleGraph?.links,
    initialLinkedAggregations: exampleGraph?.linkedAggregations,
    initialTemporalAxes: temporalAxes,
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
      // @todo-0.3 revert this hardcoded version to ${mockBlockDockVersion}
      import { MockBlockDock } from "https://esm.sh/mock-block-dock@0.1.0-canary-20230220234726/dist/esm/index.js?target=es2021&deps=react@${reactVersion}";

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
            const { blockEntity, readonly } = props;
            
            const mockBlockDockProps = { blockDefinition, initialData: mockBlockDockInitialData, hideDebugToggle: true, readonly  };
            
            // Check if we've previously added the block entity from the props message
            const existingBlockEntity = mockBlockDockProps.initialData.initialEntities.find(entity => 
               entity.metadata.recordId.entityId === blockEntity.metadata.recordId.entityId
                  && entity.metadata.recordId.editionId === blockEntity.metadata.recordId.editionId
            );
            
            if (existingBlockEntity) {
              // We don't want to end up with two entities at the same record id, so we overwrite if it's been set previously
              existingBlockEntity.metadata = blockEntity.metadata;
              existingBlockEntity.properties = blockEntity.properties ?? {};
            } else {
              // This is the first render - add the block entity
              mockBlockDockProps.initialData.initialEntities.push(blockEntity);
            }

            mockBlockDockProps.blockEntityRecordId = blockEntity.metadata.recordId;
            
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
