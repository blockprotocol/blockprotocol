import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";

const production = !process.env.ROLLUP_WATCH;

const outDir = (fmt) => `dist/${fmt}`;

const rolls = (fmt, input) => ({
  input,
  output: {
    dir: outDir(fmt),
    format: fmt,
    entryFileNames: `[name].${fmt === "cjs" ? "cjs" : "js"}`,
    name: "graph",
    sourcemap: !production,
  },
  plugins: [
    typescript({
      declaration: true,
      declarationDir: outDir(fmt),
      outDir: outDir(fmt),
      rootDir: "src",
      sourceMap: !production,
      inlineSources: !production,
      outputToFilesystem: false,
    }),
    json(),
    commonjs(),
  ],
});

export default ["es", "cjs"].flatMap((fmt) =>
  [
    "src/index.ts",
    "src/codegen.ts",
    "src/custom-element.ts",
    "src/graph-module-json.ts",
    "src/internal.ts",
    "src/react.ts",
    "src/stdlib.ts",
  ].map((input) => rolls(fmt, input)),
);
