import { setWasmInit } from "./common";
import wasm from "./wasm/type-system_bg.wasm";

export { TypeSystemInitializer } from "./common";
export * from "./wasm/type-system";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
setWasmInit(() => wasm());
