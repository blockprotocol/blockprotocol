const path = require("node:path");

module.exports = {
  process(sourceText, sourcePath, options) {
    // console.log(options);

    return {
      code: `
      let imports = {};
      imports['__wbindgen_placeholder__'] = module.exports;
      
      const bytes = require('fs').readFileSync("${sourcePath}");

      const wasmModule = new WebAssembly.Module(bytes);
      const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
      module.exports = wasmInstance;
      // module.exports.__wasm = wasmInstance;
      `,
    };
  },
};
