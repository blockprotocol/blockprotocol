import path from "node:path";

import fs from "fs-extra";

import { getPort } from "./config.js";
import { generateDistBlockMetadata } from "./generate-dist-block-metadata.js";
import { generateDistExampleGraph } from "./generate-dist-example-graph.js";
import { generateDistReadme } from "./generate-dist-readme.js";
import { blockDistDirPath } from "./paths.js";

export class BlockAssetsPlugin {
  /**
   * @param {import("webpack").Compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.done.tap(this.constructor.name, async (stats) => {
      const assetsManifestFilePath = path.resolve(
        blockDistDirPath,
        "assets-manifest.json",
      );

      const defaultManifest = { "main.cjs": "main.cjs" };

      const assetsManifest = (await fs.pathExists(assetsManifestFilePath))
        ? await fs.readJson(assetsManifestFilePath).catch(() => {
            console.error("Error parsing asset manifest - using default");
            return defaultManifest;
          })
        : defaultManifest;

      /** @type Record<string, string> */
      const metadataExtra = { source: assetsManifest["main.cjs"] };

      if (stats.compilation.options.mode === "development") {
        metadataExtra.devReloadEndpoint = `ws://localhost:${await getPort(
          "development",
        )}/ws`;
      }

      await Promise.all([
        generateDistBlockMetadata(metadataExtra),
        generateDistReadme(),
        generateDistExampleGraph(assetsManifest, assetsManifestFilePath),
      ]);
    });
  }
}
