/* tslint:disable */
/* eslint-disable */
/**
* Checks if a given {PropertyType} is valid
*
* @throws {TempError} if the property type is malformed
* @param {PropertyType} propertyTypeObj
*/
export function isValidPropertyType(propertyTypeObj: PropertyType): void;
export interface TempError {}

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

type __ValidationErrorBaseUri = BaseUri;
type __ValidationErrorVersionedUri = VersionedUri;
declare namespace ValidationError {
    export type MissingRequiredProperty = { type: "MissingRequiredProperty"; inner: __ValidationErrorBaseUri };
    export type BaseUriMismatch = { type: "BaseUriMismatch"; inner: { base_uri: __ValidationErrorBaseUri; versioned_uri: __ValidationErrorVersionedUri } };
    export type MissingRequiredLink = { type: "MissingRequiredLink"; inner: __ValidationErrorVersionedUri };
    export type MismatchedPropertyCount = { type: "MismatchedPropertyCount"; inner: { actual: number; expected: number } };
    export type EmptyOneOf = { type: "EmptyOneOf"; inner?: null };
}

export type ValidationError = ValidationError.MissingRequiredProperty | ValidationError.BaseUriMismatch | ValidationError.MissingRequiredLink | ValidationError.MismatchedPropertyCount | ValidationError.EmptyOneOf;

type __ParseVersionedUriErrorParseBaseUriError = ParseBaseUriError;
declare namespace ParseVersionedUriError {
    export type IncorrectFormatting = { type: "IncorrectFormatting"; inner?: null };
    export type MissingBaseUri = { type: "MissingBaseUri"; inner?: null };
    export type MissingVersion = { type: "MissingVersion"; inner?: null };
    export type InvalidVersion = { type: "InvalidVersion"; inner?: null };
    export type AdditionalEndContent = { type: "AdditionalEndContent"; inner?: null };
    export type InvalidBaseUri = { type: "InvalidBaseUri"; inner: __ParseVersionedUriErrorParseBaseUriError };
}

export type ParseVersionedUriError = ParseVersionedUriError.IncorrectFormatting | ParseVersionedUriError.MissingBaseUri | ParseVersionedUriError.MissingVersion | ParseVersionedUriError.InvalidVersion | ParseVersionedUriError.AdditionalEndContent | ParseVersionedUriError.InvalidBaseUri;

declare namespace ParseBaseUriError {
    export type MissingTrailingSlash = { reason: "MissingTrailingSlash"; inner?: null };
    export type UrlParseError = { reason: "UrlParseError"; inner: string };
    export type CannotBeABase = { reason: "CannotBeABase"; inner?: null };
}

export type ParseBaseUriError = ParseBaseUriError.MissingTrailingSlash | ParseBaseUriError.UrlParseError | ParseBaseUriError.CannotBeABase;

declare namespace Result {
    export type Ok<T> = { type: "Ok"; inner: T };
    export type Err<E> = { type: "Err"; inner: E };
}

export type Result<T, E> = Result.Ok<T> | Result.Err<E>;

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

export interface Object<V> extends ObjectRepr<V> {}

export interface ObjectRepr<V> {
    type: 'object';
    properties: Record<BaseUri, V>;
    required?: BaseUri[];
}

export type BaseUri = string;

export interface OneOfRepr<T> {
    oneOf: T[];
}

export interface OneOf<T> extends OneOfRepr<T> {}

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
    pluralTitle: string;
    description?: string;
}

export type VersionedUri = `${string}/v/${number}`;


/**
 * Checks if a given URL string is a valid base URL.
 * 
 * @param {BaseUri} uri - The URL string.
 * @returns {Result} - @todo
 */
export function validateBaseUri(uri: string): Result<BaseUri, ParseBaseUriError>;



/**
 * Checks if a given URL string is a Block Protocol compliant Versioned URI.
 *
 * @param {string} uri - The URL string.
 * @returns {Result} - @todo
 */
export function validateVersionedUri(uri: string): Result<VersionedUri, ParseVersionedUriError>;



/**
 * Extracts the base URI from a Versioned URI.
 *
 * @param {VersionedUri} uri - The versioned URI.
 * @throws {ParseVersionedUriError} if the versioned URI is invalid.
 */
export function extractBaseUri(uri: VersionedUri): BaseUri;



/**
 * Extracts the version from a Versioned URI.
 *
 * @param {VersionedUri} uri - The versioned URI.
 * @throws {ParseVersionedUriError} if the versioned URI is invalid.
 */
export function extractVersion(uri: VersionedUri): number;


/**
*/
export class TempError {
  free(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_temperror_free: (a: number) => void;
  readonly isValidPropertyType: (a: number, b: number) => void;
  readonly validateBaseUri: (a: number, b: number) => number;
  readonly validateVersionedUri: (a: number, b: number) => number;
  readonly extractBaseUri: (a: number, b: number, c: number) => void;
  readonly extractVersion: (a: number, b: number, c: number) => void;
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
