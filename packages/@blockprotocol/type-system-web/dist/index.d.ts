/* tslint:disable */
/* eslint-disable */
/**
* Takes a URL string and attempts to parse it into a valid URL, returning it in standardized form
*
* @throws {ParseBaseUriError} if the given string is not a valid base URI
* @param {string} uri
* @returns {string}
*/
export function parseBaseUri(uri: string): string;
/**
* Checks if a given URL string is a Block Protocol compliant Versioned URI.
*
* @throws {ParseVersionedUriError} if the versioned URI is invalid
* @param {string} uri
*/
export function isValidVersionedUri(uri: string): void;
/**
* Checks if a given {DataType} is valid
*
* @throws {MalformedDataTypeError} if the data type is malformed
* @param {DataType} dataTypeObj
*/
export function isValidDataType(dataTypeObj: DataType): void;
export interface DataType extends Record<string, any> {
    kind: 'dataType';
    $id: VersionedUri;
    title: string;
    description?: string;
    type: string;
}

/**
*/
export class MalformedDataTypeError {
  free(): void;
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

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly parseBaseUri: (a: number, b: number, c: number) => void;
  readonly isValidVersionedUri: (a: number, b: number, c: number) => void;
  readonly isValidDataType: (a: number, b: number) => void;
  readonly __wbg_malformeddatatypeerror_free: (a: number) => void;
  readonly __wbg_parsebaseurierror_free: (a: number) => void;
  readonly __wbg_parseversionedurierror_free: (a: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
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
