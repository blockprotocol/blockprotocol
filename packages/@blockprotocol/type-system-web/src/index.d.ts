/* tslint:disable */
/* eslint-disable */
/**
*/
export class BaseUri {
  free(): void;
/**
* @param {string} uri
*/
  constructor(uri: string);
/**
* @returns {string}
*/
  toString(): string;
/**
* @returns {any}
*/
  toJSON(): any;
}
/**
*/
export class ParseBaseUriError {
  free(): void;
}
/**
*/
export class ParseVersionedUriError {
  free(): void;
}
/**
*/
export class VersionedUri {
  free(): void;
/**
* Creates a new `VersionedUri` from the given `base_uri` and `version`.
* @param {BaseUri} base_uri
* @param {number} version
*/
  constructor(base_uri: BaseUri, version: number);
/**
* @returns {string}
*/
  toString(): string;
/**
* @returns {any}
*/
  toJSON(): any;
/**
*/
  readonly baseUri: BaseUri;
/**
*/
  readonly version: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_parsebaseurierror_free: (a: number) => void;
  readonly __wbg_parseversionedurierror_free: (a: number) => void;
  readonly baseuri_new: (a: number, b: number, c: number) => void;
  readonly baseuri_toString: (a: number, b: number) => void;
  readonly baseuri_toJSON: (a: number) => number;
  readonly versioneduri_new: (a: number, b: number, c: number) => void;
  readonly versioneduri_base_uri: (a: number) => number;
  readonly versioneduri_version: (a: number) => number;
  readonly versioneduri_toString: (a: number, b: number) => void;
  readonly versioneduri_toJSON: (a: number) => number;
  readonly __wbg_baseuri_free: (a: number) => void;
  readonly __wbg_versioneduri_free: (a: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
}

/**
* Synchronously compiles the given `bytes` and instantiates the WebAssembly module.
*
* @param {BufferSource} bytes
*
* @returns {InitOutput}
*/
export function initSync(bytes: BufferSource): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
