import * as path from "node:path";
import * as child_process from "child_process";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The PathObject definition in Node's path package
type PathObject = {
  dir: string;
  root: string;
  base: string;
  name: string;
  ext: string;
};

const runWasmPack = (target: string) => {
  console.log(`Running wasm-pack targeting ${target}`);
  const { error } = child_process.spawnSync("wasm-pack", [
    "build",
    "--target",
    target,
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

const moveSrcFiles = (packagePath: PathObject, packageName: string) => {
  const destinationPath = path.resolve(
    __dirname,
    "..",
    "..",
    "packages",
    "@blockprotocol",
    packageName,
    "src",
  );

  console.log(
    `Moving src files of ${path.format(packagePath)} to ${destinationPath}`,
  );

  fs.copySync(path.format(packagePath), destinationPath, {
    overwrite: true,
    filter: (src) => {
      if (fs.statSync(src).isDirectory()) {
        return true;
      }
      // Only copy src files
      return [".js", ".d.ts", ".wasm"].some((ending) => src.endsWith(ending));
    },
  });
};

const cleanUp = (packagePath: PathObject) => {
  fs.rmSync(path.format(packagePath), { recursive: true });
};

const buildWasmPackage = (
  packageName: string,
  target: string,
  patch: object,
) => {
  runWasmPack(target);

  const packageJsonPath = path.resolve(path.join("pkg", "package.json"));
  patchPackageJson(packageJsonPath, patch);
  runPrettier(packageJsonPath);

  const pkgFolderPath = path.parse(path.resolve("./pkg/"));

  moveSrcFiles(pkgFolderPath, packageName);
  cleanUp(pkgFolderPath);
};

const buildPackages = () => {
  const webName = "type-system-web";
  const webPatch = {
    name: `@blockprotocol/${webName}`,
    module: "src/index.js",
    types: "src/index.d.ts",
    files: ["src/index_bg.wasm", "src/index.js", "src/index.d.ts"],
  };
  buildWasmPackage(webName, "web", webPatch);

  const nodeName = "type-system-node";
  const nodePatch = {
    name: `@blockprotocol/${nodeName}`,
    scripts: {
      test: "jest",
    },
    devDependencies: {
      "@types/jest": "28.1.4",
      jest: "28.1.2",
      "ts-jest": "28.0.5",
    },
    module: "src/index.js",
    types: "src/index.d.ts",
    files: ["src/index_bg.wasm", "src/index.js", "src/index.d.ts"],
  };
  buildWasmPackage(nodeName, "nodejs", nodePatch);
};

buildPackages();
