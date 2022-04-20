const fs = require("fs");
const { promisify } = require("util");
const path = require("path");

const writeFile = promisify(fs.writeFile);
const beautify = (obj) => JSON.stringify(obj, null, 2);

const packageJsonPath = path.resolve(process.cwd(), "./package.json");
const variantsJsonPath = path.resolve(process.cwd(), "./variants.json");

const {
  name,
  version,
  description,
  author,
  license,
  blockprotocol,
  peerDependencies,
  // eslint-disable-next-line import/no-dynamic-require
} = require(packageJsonPath);

const variants = fs.existsSync(variantsJsonPath)
  ? // eslint-disable-next-line import/no-dynamic-require
    require(variantsJsonPath)
  : undefined;

class StatsPlugin {
  apply(compiler) {
    compiler.hooks.done.tap(this.constructor.name, (stats) => {
      const main = Object.keys(stats.compilation.assets).find(
        (asset) => asset.startsWith("main") && asset.endsWith(".js"),
      );

      const blockMetadata = {
        name,
        version,
        description,
        author,
        license,
        externals: peerDependencies,
        schema: "block-schema.json",
        source: main,
        variants,
        ...blockprotocol,
      };

      return writeFile(
        "dist/block-metadata.json",
        beautify(blockMetadata),
        "utf8",
      );
    });
  }
}

module.exports = { StatsPlugin };
