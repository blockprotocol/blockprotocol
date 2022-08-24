import fs from "fs-extra";
import path from "node:path";

import { getPort } from "./config.js";
import { generateDistBlockMetadata } from "./generate-dist-block-metadata.js";
import { generateDistBlockSchema } from "./generate-dist-block-schema.js";
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

      const assetsManifest = (await fs.pathExists(assetsManifestFilePath))
        ? await fs.readJson(assetsManifestFilePath)
        : { "main.js": "main.js" };

      const metadataExtra = { source: assetsManifest["main.js"] };

      if (stats.compilation.options.mode === "development") {
        metadataExtra.devReloadEndpoint = `ws://localhost:${await getPort(
          "development",
        )}/ws`;
      }

      await Promise.all([
        generateDistBlockMetadata(metadataExtra),
        generateDistBlockSchema(),
        generateDistReadme(),
        generateDistExampleGraph(),
      ]);
    });
  }
}
