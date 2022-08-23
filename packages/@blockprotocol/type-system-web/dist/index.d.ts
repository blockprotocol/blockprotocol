/* tslint:disable */
/* eslint-disable */
/**
* Checks if a given {DataType} is valid
*
* @throws {MalformedDataTypeError} if the data type is malformed
* @param {DataType} dataTypeObj
*/
export function isValidDataType(dataTypeObj: DataType): void;
/**
* Checks if a given {PropertyType} is valid
*
* @throws {TempError} if the property type is malformed
* @param {PropertyType} propertyTypeObj
*/
export function isValidPropertyType(propertyTypeObj: PropertyType): void;
type __ValueOrArrayArray<A> = Array<A>;
declare namespace ValueOrArray {
    export type Value<T> = T;
    export type Array<T> = __ValueOrArrayArray<T>;
}

export type ValueOrArray<T> = ValueOrArray.Value<T> | ValueOrArray.Array<T>;

export interface Array<T> {
    type: 'array';
    items: T;
    minItems?: number;
    maxItems?: number;
}

export interface OneOfRepr<T> {
    oneOf: T[];
}

export interface OneOf<T> extends OneOfRepr<T> {}

export interface Object<V> extends ObjectRepr<V> {}

export interface ObjectRepr<V> {
    type: 'object';
    properties: Record<BaseUri, V>;
    required?: BaseUri[];
}

export interface DataTypeReference {
    $ref: VersionedUri;
}

export interface DataType extends Record<string, any> {
    kind: 'dataType';
    $id: VersionedUri;
    title: string;
    description?: string;
    type: string;
}

export type VersionedUri = `${string}/v/${number}`;


/**
 * Takes a URL string and attempts to parse it into a valid URL, returning it in standardized form.
 * 
 * @param {BaseUri} uri - The URL string.
 * @throws {ParseBaseUriError} if the given string is not a valid base URI
 */
export function parseBaseUri(uri: BaseUri): BaseUri;



/**
 * Checks if a given URL string is a Block Protocol compliant Versioned URI.
 * 
 * @param {VersionedUri} uri - The URL string.
 * @throws {ParseVersionedUriError} if the versioned URI is invalid
 */
export function isValidVersionedUri(uri: VersionedUri): void;


export type BaseUri = string;

export interface PropertyTypeReference {
    $ref: VersionedUri;
}

type __PropertyValuesDataTypeReference = DataTypeReference;
type __PropertyValuesObject<A> = Object<A>;
type __PropertyValuesPropertyTypeReference = PropertyTypeReference;
type __PropertyValuesValueOrArray<A> = ValueOrArray<A>;
declare namespace PropertyValues {
    export type DataTypeReference = __PropertyValuesDataTypeReference;
    export type PropertyTypeObject = __PropertyValuesObject<__PropertyValuesValueOrArray<__PropertyValuesPropertyTypeReference>>;
    export type ArrayOfPropertyValues = Array<OneOf<PropertyValues>>;
}

export type PropertyValues = PropertyValues.DataTypeReference | PropertyValues.PropertyTypeObject | PropertyValues.ArrayOfPropertyValues;

export interface PropertyType extends OneOf<PropertyValues> {
    kind: 'propertyType';
    $id: VersionedUri;
    title: string;
    description?: string;
}

export interface TempError {}

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
/**
*/
export class TempError {
  free(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly isValidDataType: (a: number, b: number) => void;
  readonly parseBaseUri: (a: number, b: number, c: number) => void;
  readonly isValidVersionedUri: (a: number, b: number, c: number) => void;
  readonly __wbg_malformeddatatypeerror_free: (a: number) => void;
  readonly __wbg_parsebaseurierror_free: (a: number) => void;
  readonly __wbg_parseversionedurierror_free: (a: number) => void;
  readonly __wbg_temperror_free: (a: number) => void;
  readonly isValidPropertyType: (a: number, b: number) => void;
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
