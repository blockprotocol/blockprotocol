import wasm from "../wasm/type-system_bg.wasm";
import { setWasmInit } from "./common";

export * from "../wasm/type-system";
export { TypeSystemInitializer } from "./common";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
setWasmInit(() => wasm());
