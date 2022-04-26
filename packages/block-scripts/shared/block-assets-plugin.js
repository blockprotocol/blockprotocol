import { generateDistBlockMetadata } from "./generate-dist-block-metadata.js";
import { generateDistBlockSchema } from "./generate-dist-block-schema.js";
import { generateDistReadme } from "./generate-dist-readme.js";

export class BlockAssetsPlugin {
  apply(compiler) {
    compiler.hooks.done.tap(this.constructor.name, async (stats) => {
      const source = Object.keys(stats.compilation.assets).find(
        (asset) => asset.startsWith("main") && asset.endsWith(".js"),
      );

      await Promise.all([
        generateDistBlockMetadata(source),
        generateDistBlockSchema(),
        generateDistReadme(),
      ]);
    });
  }
}
