import { ensureBlockMetadataInDist } from "./ensure-block-metadata-in-dist.js";
import { ensureBlockSchemaInDist } from "./ensure-block-schema-in-dist.js";
import { ensureReadmeInDist } from "./ensure-readme-in-dist.js";

export class BlockAssetsPlugin {
  apply(compiler) {
    compiler.hooks.done.tap(this.constructor.name, async (stats) => {
      const source = Object.keys(stats.compilation.assets).find(
        (asset) => asset.startsWith("main") && asset.endsWith(".js"),
      );

      await Promise.all([
        ensureBlockMetadataInDist(source),
        ensureBlockSchemaInDist(),
        ensureReadmeInDist(),
      ]);
    });
  }
}
