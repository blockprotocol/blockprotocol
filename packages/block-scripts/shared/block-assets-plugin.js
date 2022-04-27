import fs from "fs-extra";
import path from "path";

import { generateDistBlockMetadata } from "./generate-dist-block-metadata.js";
import { generateDistBlockSchema } from "./generate-dist-block-schema.js";
import { generateDistReadme } from "./generate-dist-readme.js";
import { blockDistDirPath } from "./paths.js";

export class BlockAssetsPlugin {
  apply(compiler) {
    compiler.hooks.done.tap(this.constructor.name, async () => {
      const assetsManifestFilePath = path.resolve(
        blockDistDirPath,
        "assets-manifest.json",
      );

      const assetsManifest = (await fs.pathExists(assetsManifestFilePath))
        ? await fs.readJson(assetsManifestFilePath)
        : { "main.js": "main.js" };

      const source = assetsManifest["main.js"];

      await Promise.all([
        generateDistBlockMetadata(source),
        generateDistBlockSchema(),
        generateDistReadme(),
      ]);
    });
  }
}
