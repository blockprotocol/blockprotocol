import { JSONObject } from "blockprotocol";
import { NextApiHandler } from "next";

import packageJson from "../../../../package.json";
import { readBlockDataFromDisk, readBlocksFromDisk } from "../../../lib/blocks";

/**
 * @todo remove after fixing
 * - https://blockprotocol.org/@jmackie/blocks/quote
 * - https://blockprotocol.org/@shinypb/blocks/emoji-trading-cards
 * - https://blockprotocol.org/@kickstartds/blocks/button
 */
const hotfixExternals = (externals: JSONObject | undefined): JSONObject => {
  return (
    externals ?? {
      react: packageJson.dependencies.react,
      lodash: packageJson.dependencies.lodash,
      twind: packageJson.dependencies.twind,
    }
  );
};

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

  const catalog = readBlocksFromDisk();

  const packagePath = `${req.query.shortname}/${req.query.blockslug}`;

  const blockMetadata = catalog.find(
    (metadata) => metadata.packagePath === packagePath,
  );

  if (!blockMetadata) {
    res.status(404);
    res.write("Block not found");
    res.end();
    return;
  }

  const { source } = await readBlockDataFromDisk(blockMetadata);
  const mockBlockDockVersion = packageJson.dependencies["mock-block-dock"];
  const reactVersion =
    blockMetadata.externals?.react ?? packageJson.dependencies.react;

  const externalUrlLookup: Record<string, string> = {};

  const externals = hotfixExternals(blockMetadata.externals);

  for (const [packageName, packageVersion] of Object.entries(externals)) {
    externalUrlLookup[packageName] = `https://esm.sh/${hotfixPackageName(
      packageName,
    )}@${packageVersion}`;
  }

  const html = `
    <script type="module">
      const handleMessage = ({ data }) => {
        if (typeof data !== "string") {
          return;
        }
        globalThis.initialBlockProps = JSON.parse(data);
        window.removeEventListener("message", handleMessage);
      }
      window.addEventListener("message", handleMessage);
    </script>
    <script type="module">
      import React from "https://esm.sh/react@${reactVersion}"
      import ReactDOM from "https://esm.sh/react-dom@${reactVersion}"
      import { jsx as _jsx } from "https://esm.sh/react@${reactVersion}/jsx-runtime.js";
      import { MockBlockDock } from "https://esm.sh/mock-block-dock@${mockBlockDockVersion}?alias=lodash:lodash-es&deps=react@${reactVersion}"

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

      const blockSource = ${JSON.stringify(source)};
      const BlockComponent = findComponentExport(loadCjsFromSource(blockSource));
      const render = (blockComponentProps) => {
        ReactDOM.render(
          _jsx(MockBlockDock, { children: _jsx(BlockComponent, blockComponentProps) }),
          document.getElementById("container")
        );
      }

      window.addEventListener("message", ({ data }) => { if (typeof data === "string") { render(JSON.parse(data)) }});

      if (globalThis.initialBlockProps) {
        render(globalThis.initialBlockProps)
      }
      </script>
    <div id="container"></div>
  `;

  res.status(200);
  res.write(html);
  res.end();
};

export default handler;
