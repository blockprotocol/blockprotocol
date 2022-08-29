/* tslint:disable */
/* eslint-disable */

/**
 * Checks if a given Data Type is correctly formed
 *
 * @param {DataType} dataType - The Data Type object to validate.
 * @returns {Result} - @todo
 */
export function validateDataType(dataType: DataType): Result<undefined, ParseDataTypeError>;



/**
 * Checks if a given Property Type is correctly formed
 *
 * @param {PropertyType} propertyType - The Property Type object to validate.
 * @returns {Result} - @todo
 */
export function validatePropertyType(propertyType: PropertyType): Result<undefined, ParsePropertyTypeError>;


export interface DataTypeReference {
    $ref: string;
}

export interface DataType extends Record<string, any> {
    kind: 'dataType';
    $id: string;
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
    export type IncorrectFormatting = { reason: "IncorrectFormatting"; inner?: null };
    export type MissingBaseUri = { reason: "MissingBaseUri"; inner?: null };
    export type MissingVersion = { reason: "MissingVersion"; inner?: null };
    export type InvalidVersion = { reason: "InvalidVersion"; inner?: null };
    export type AdditionalEndContent = { reason: "AdditionalEndContent"; inner?: null };
    export type InvalidBaseUri = { reason: "InvalidBaseUri"; inner: __ParseVersionedUriErrorParseBaseUriError };
    export type InvalidJson = { reason: "InvalidJson"; inner: string };
}

export type ParseVersionedUriError = ParseVersionedUriError.IncorrectFormatting | ParseVersionedUriError.MissingBaseUri | ParseVersionedUriError.MissingVersion | ParseVersionedUriError.InvalidVersion | ParseVersionedUriError.AdditionalEndContent | ParseVersionedUriError.InvalidBaseUri | ParseVersionedUriError.InvalidJson;

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

export interface PropertyTypeReference {
    $ref: string;
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
    $id: string;
    title: string;
    pluralTitle: string;
    description?: string;
}

export interface OneOf<T> {
    oneOf: T[];
}

type __ParseOneOfErrorValidationError = ValidationError;
declare namespace ParseOneOfError {
    export type ValidationError = { reason: "ValidationError"; inner: __ParseOneOfErrorValidationError };
}

export type ParseOneOfError = ParseOneOfError.ValidationError;

type __ParsePropertyTypeObjectErrorParseBaseUriError = ParseBaseUriError;
type __ParsePropertyTypeObjectErrorValidationError = ValidationError;
declare namespace ParsePropertyTypeObjectError {
    export type InvalidPropertyKey = { reason: "InvalidPropertyKey"; inner: __ParsePropertyTypeObjectErrorParseBaseUriError };
    export type InvalidRequiredKey = { reason: "InvalidRequiredKey"; inner: __ParsePropertyTypeObjectErrorParseBaseUriError };
    export type ValidationError = { reason: "ValidationError"; inner: __ParsePropertyTypeObjectErrorValidationError };
    export type InvalidJson = { reason: "InvalidJson"; inner: string };
}

export type ParsePropertyTypeObjectError = ParsePropertyTypeObjectError.InvalidPropertyKey | ParsePropertyTypeObjectError.InvalidRequiredKey | ParsePropertyTypeObjectError.ValidationError | ParsePropertyTypeObjectError.InvalidJson;

declare namespace ParseArrayError {
    export type InvalidJson = { reason: "InvalidJson"; inner: string };
}

export type ParseArrayError = ParseArrayError.InvalidJson;

type __ParsePropertyTypeErrorParseVersionedUriError = ParseVersionedUriError;
declare namespace ParsePropertyTypeError {
    export type InvalidVersionedUri = { reason: "InvalidVersionedUri"; inner: __ParsePropertyTypeErrorParseVersionedUriError };
    export type InvalidDataTypeReference = { reason: "InvalidDataTypeReference"; inner: __ParsePropertyTypeErrorParseVersionedUriError };
    export type InvalidArrayItems = { reason: "InvalidArrayItems"; inner: [] };
    export type InvalidPropertyTypeObject = { reason: "InvalidPropertyTypeObject"; inner: [] };
    export type InvalidJson = { reason: "InvalidJson"; inner: string };
}

export type ParsePropertyTypeError = ParsePropertyTypeError.InvalidVersionedUri | ParsePropertyTypeError.InvalidDataTypeReference | ParsePropertyTypeError.InvalidArrayItems | ParsePropertyTypeError.InvalidPropertyTypeObject | ParsePropertyTypeError.InvalidJson;

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


export interface Object<T> {
    type: 'object';
    properties: Record<string, T>;
    required?: string[];
}

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

type __ParseDataTypeErrorParseVersionedUriError = ParseVersionedUriError;
declare namespace ParseDataTypeError {
    export type InvalidVersionedUri = { reason: "InvalidVersionedUri"; inner: __ParseDataTypeErrorParseVersionedUriError };
    export type InvalidJson = { reason: "InvalidJson"; inner: string };
}

export type ParseDataTypeError = ParseDataTypeError.InvalidVersionedUri | ParseDataTypeError.InvalidJson;

export type BaseUri = string;


export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly validateDataType: (a: number) => number;
  readonly validatePropertyType: (a: number) => number;
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
