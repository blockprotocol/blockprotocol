import * as path from "node:path";
import * as child_process from "child_process";
import * as fs from "fs";

// The PathObject definition in Node's path package
type PathObject = {
  dir: string;
  root: string;
  base: string;
  name: string;
  ext: string;
};

const runWasmPack = (target: string, outDir: PathObject) => {
  console.log(
    `Running wasm-pack, targeting ${target}, for ${path.format(outDir)}`,
  );
  const { error } = child_process.spawnSync("wasm-pack", [
    "build",
    "--target",
    target,
    "--out-dir",
    path.format(outDir),
    "--out-name",
    "index",
    "--scope",
    "blockprotocol",
  ]);
  if (error) {
    throw error;
  }
};

const patchPackageJson = (filePath: string, uniquePatch: object) => {
  console.log(`Patching ${filePath}`);

  let patch = {
    homepage: "https://blockprotocol.org",
    repository: {
      type: "git",
      url: "git@github.com:blockprotocol/blockprotocol.git",
    },
    license: "MIT",
    author: {
      name: "HASH",
      url: "https://hash.ai",
    },
    ...uniquePatch,
  };

  const contents = JSON.parse(fs.readFileSync(filePath, "utf8"));
  fs.writeFileSync(filePath, JSON.stringify({ ...contents, ...patch }));
};

const runPrettier = (filePath: string) => {
  const { error } = child_process.spawnSync("yarn", [
    "prettier",
    "--write",
    filePath,
  ]);
  if (error) {
    throw error;
  }
};

const buildWasmPackage = (
  packagePath: PathObject,
  target: string,
  patch: object,
) => {
  runWasmPack(target, packagePath);
  const packageJsonPath = path.resolve(
    path.join(path.format(packagePath), "package.json"),
  );
  patchPackageJson(packageJsonPath, patch);
  runPrettier(packageJsonPath);
};

const buildPackages = () => {
  const webPatch = { name: "@blockprotocol/type-system-web" };
  buildWasmPackage(path.parse("../ts/type-system-web"), "web", webPatch);

  const nodePatch = { name: "@blockprotocol/type-system-node" };
  buildWasmPackage(path.parse("../ts/type-system-node"), "nodejs", nodePatch);
};

buildPackages();
