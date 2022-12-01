import fs from "node:fs";
import path from "node:path";

import typescript from "@rollup/plugin-typescript";
import { wasm } from "@rollup/plugin-wasm";

const production = !process.env.ROLLUP_WATCH;

const outdir = (fmt, env) => {
  if (env === "node") {
    return `dist/node`;
  } else {
    return `dist/${fmt}${env === "slim" ? "-slim" : ""}`;
  }
};

const rolls = (fmt, env) => ({
  input: env !== "slim" ? "src/index.ts" : "src/index-slim.ts",
  output: {
    dir: outdir(fmt, env),
    format: fmt,
    entryFileNames: `[name].${fmt === "cjs" ? "cjs" : "js"}`,
    name: "type-system",
    sourcemap: !production,
  },
  plugins: [
    // We want to inline our wasm bundle as base64 on non-slim builds.
    env !== "slim" ? wasm({ targetEnv: "auto-inline" }) : undefined,
    typescript({
      declaration: true,
      declarationDir: outdir(fmt, env),
      outDir: outdir(fmt, env),
      rootDir: "src",
      sourceMap: !production,
      inlineSources: !production,
      outputToFilesystem: false,
    }),
    {
      name: "copy-pkg",
      // wasm-bindgen outputs an import.meta.url when using the web target.
      // rollup will either preserve the statement when outputting an esm,
      // which will cause webpack < 5 to choke, or it will output a
      // "require('url')", for other output types, causing more choking. Since
      // we want a downstream developer to either not worry about providing wasm
      // at all, or forcing them to deal with bundling, we resolve the import to
      // an empty string. This will error at runtime.
      resolveImportMeta: () => `""`,
      generateBundle() {
        const dir = outdir(fmt, env);
        fs.mkdirSync(path.resolve(`${dir}/wasm`), { recursive: true });

        /** @todo - Can we copy these to a top-level folder that's shared between the targets, and then rewrite the
         *    imports? That should decrease the package size a lot as they're all duplicated at the moment
         */
        fs.copyFileSync(
          "./src/wasm/type-system_bg.wasm",
          `${dir}/wasm/type-system.wasm`,
        );
        // copy the typescript definitions that wasm-bindgen creates into the
        // distribution so that downstream users can benefit from documentation
        // on the rust code
        fs.copyFileSync(
          "./src/wasm/type-system_bg.wasm.d.ts",
          `${dir}/wasm/type-system.wasm.d.ts`,
        );
        fs.copyFileSync(
          path.resolve("./src/wasm/type-system.d.ts"),
          path.resolve(`${dir}/wasm/type-system.d.ts`),
        );
      },
    },
  ],
});

export default [
  rolls("umd", "fat"),
  rolls("es", "fat"),
  rolls("cjs", "fat"),
  rolls("cjs", "node"),
  /** @todo - re-enable these when we figure out the issues with `can't resolve "wbg"` */
  // rolls("es", "slim"),
  // rolls("cjs", "slim"),
];
