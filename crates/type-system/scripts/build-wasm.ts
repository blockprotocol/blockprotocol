import fs from "fs-extra";
// @todo consider using execa
import * as child_process from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

export const packageDirPath = path.dirname(fileURLToPath(import.meta.url));

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
  const result = child_process.spawnSync("wasm-pack", [
    "build",
    "--target",
    target,
    "--out-name",
    "index",
    "--scope",
    "blockprotocol",
  ]);

  if (result.status !== 0) {
    console.log(result.stdout.toString());
    console.log(result.stderr.toString());
    throw new Error("Running wasm-pack failed");
  }
};

const moveSrcFiles = (packagePath: PathObject, packageName: string) => {
  const destinationPath = path.resolve(
    packageDirPath,
    "..",
    "..",
    "..",
    "packages",
    "@blockprotocol",
    packageName,
    "dist",
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

const buildWasmPackage = (packageName: string, target: string) => {
  runWasmPack(target);

  const pkgFolderPath = path.parse(path.resolve("./pkg/"));

  moveSrcFiles(pkgFolderPath, packageName);
  cleanUp(pkgFolderPath);
};

const buildPackages = () => {
  buildWasmPackage("type-system-web", "web");
  buildWasmPackage("type-system-node", "nodejs");
};

buildPackages();
