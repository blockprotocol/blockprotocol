// Context:
// https://github.com/nodejs/node/issues/30810
// https://github.com/yarnpkg/berry/blob/2cf0a8fe3e4d4bd7d4d344245d24a85a45d4c5c9/packages/yarnpkg-pnp/sources/loader/applyPatch.ts#L414-L435

const originalEmit = process.emit;

// @ts-expect-error -- TS is unable to untangle all emit overloads
process.emit = (name, data, ...args) => {
  if (
    name === `warning` &&
    data instanceof Error &&
    data.name === `ExperimentalWarning` &&
    (data.message.includes(`--experimental-loader`) ||
      data.message.includes(`specifier resolution`) ||
      data.message.includes(`Custom ESM Loaders is an experimental feature`) ||
      data.message.includes(`The Fetch API is an experimental feature`) ||
      data.message.includes(
        `Importing WebAssembly modules is an experimental feature`,
      ))
  ) {
    return false;
  }

  // @ts-expect-error -- TS is unable to untangle all emit overloads
  return originalEmit.apply(process, [name, data, ...args]);
};
