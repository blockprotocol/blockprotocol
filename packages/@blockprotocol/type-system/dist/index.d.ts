/* tslint:disable */
/* eslint-disable */
export interface OneOf<T> {
    oneOf: [T, ...T[]];
}

export interface Object<T> {
    type: 'object';
    properties: Record<BaseUri, T>;
    required?: BaseUri[];
}

<<<<<<< HEAD:packages/@blockprotocol/type-system/dist/index.d.ts
type __ValueOrArrayArray<A> = Array<A>;
declare namespace ValueOrArray {
    export type Value<T> = T;
    export type Array<T> = __ValueOrArrayArray<T>;
}

export type ValueOrArray<T> = ValueOrArray.Value<T> | ValueOrArray.Array<T>;
=======
export type ValueOrArray<T> = T | Array<T>;
>>>>>>> origin/main:packages/@blockprotocol/type-system-node/dist/index.d.ts

export interface Array<T> {
    type: 'array';
    items: T;
    minItems?: number;
    maxItems?: number;
}


/**
 * Checks if a given Data Type is correctly formed
 *
 * @param {DataType} dataType - The Data Type object to validate.
 * @returns {(Result.Ok|Result.Err<ParseDataTypeError>)} - an Ok with null inner if valid, or an Err with an inner ParseDataTypeError  
 */
export function validateDataType(dataType: DataType): Result<undefined, ParseDataTypeError>;



/**
 * Checks if a given Entity Type is correctly formed
 *
 * @param {EntityType} entityType - The Entity Type object to validate.
 * @returns {(Result.Ok|Result.Err<ParseEntityTypeError>)} - an Ok with null inner if valid, or an Err with an inner ParseEntityTypeError  
 */
export function validateEntityType(entityType: EntityType): Result<undefined, ParseEntityTypeError>;


<<<<<<< HEAD:packages/@blockprotocol/type-system/dist/index.d.ts

/**
 * Checks if a given Link Type is correctly formed
 *
 * @param {LinkType} linkType - The Link Type object to validate.
 * @returns {(Result.Ok|Result.Err<ParseLinkTypeError>)} - an Ok with null inner if valid, or an Err with an inner ParseLinkTypeError  
 */
export function validateLinkType(linkType: LinkType): Result<undefined, ParseLinkTypeError>;


type __ParseEntityTypeErrorParseBaseUriError = ParseBaseUriError;
type __ParseEntityTypeErrorParseLinksError = ParseLinksError;
type __ParseEntityTypeErrorParsePropertyTypeObjectError = ParsePropertyTypeObjectError;
type __ParseEntityTypeErrorParseVersionedUriError = ParseVersionedUriError;
declare namespace ParseEntityTypeError {
    export type InvalidPropertyTypeObject = { reason: "InvalidPropertyTypeObject"; inner: __ParseEntityTypeErrorParsePropertyTypeObjectError };
    export type InvalidLinks = { reason: "InvalidLinks"; inner: __ParseEntityTypeErrorParseLinksError };
    export type InvalidDefaultKey = { reason: "InvalidDefaultKey"; inner: __ParseEntityTypeErrorParseBaseUriError };
    export type InvalidExamplesKey = { reason: "InvalidExamplesKey"; inner: __ParseEntityTypeErrorParseBaseUriError };
    export type InvalidVersionedUri = { reason: "InvalidVersionedUri"; inner: __ParseEntityTypeErrorParseVersionedUriError };
    export type InvalidJson = { reason: "InvalidJson"; inner: string };
}

export type ParseEntityTypeError = ParseEntityTypeError.InvalidPropertyTypeObject | ParseEntityTypeError.InvalidLinks | ParseEntityTypeError.InvalidDefaultKey | ParseEntityTypeError.InvalidExamplesKey | ParseEntityTypeError.InvalidVersionedUri | ParseEntityTypeError.InvalidJson;

type __ParsePropertyTypeReferenceArrayErrorParseVersionedUriError = ParseVersionedUriError;
declare namespace ParsePropertyTypeReferenceArrayError {
    export type InvalidReference = { reason: "InvalidReference"; inner: __ParsePropertyTypeReferenceArrayErrorParseVersionedUriError };
    export type InvalidJson = { reason: "InvalidJson"; inner: string };
}

export type ParsePropertyTypeReferenceArrayError = ParsePropertyTypeReferenceArrayError.InvalidReference | ParsePropertyTypeReferenceArrayError.InvalidJson;

type __ParseOneOfArrayErrorParseOneOfError = ParseOneOfError;
declare namespace ParseOneOfArrayError {
    export type InvalidItems = { reason: "InvalidItems"; inner: __ParseOneOfArrayErrorParseOneOfError };
    export type InvalidJson = { reason: "InvalidJson"; inner: string };
}

export type ParseOneOfArrayError = ParseOneOfArrayError.InvalidItems | ParseOneOfArrayError.InvalidJson;

export interface LinkType {
    kind: 'linkType';
    $id: string;
    title: string;
    pluralTitle: string;
    description: string;
    relatedKeywords?: string[];
}

export interface PropertyType extends OneOf<PropertyValues> {
    kind: 'propertyType';
    $id: string;
    title: string;
    pluralTitle: string;
    description?: string;
}

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

=======
>>>>>>> origin/main:packages/@blockprotocol/type-system-node/dist/index.d.ts

/**
 * Checks if a given Property Type is correctly formed
 *
 * @param {PropertyType} propertyType - The Property Type object to validate.
 * @returns {(Result.Ok|Result.Err<ParsePropertyTypeError>)} - an Ok with null inner if valid, or an Err with an inner ParsePropertyTypeError  
 */
export function validatePropertyType(propertyType: PropertyType): Result<undefined, ParsePropertyTypeError>;


export type ParseLinksError = { reason: "InvalidLinkKey"; inner: ParseVersionedUriError } | { reason: "InvalidArray"; inner: ParseEntityTypeReferenceArrayError } | { reason: "InvalidRequiredKey"; inner: ParseVersionedUriError } | { reason: "ValidationError"; inner: ValidationError } | { reason: "InvalidJson"; inner: string };

export type ParseDataTypeError = { reason: "InvalidVersionedUri"; inner: ParseVersionedUriError } | { reason: "InvalidJson"; inner: string };

<<<<<<< HEAD:packages/@blockprotocol/type-system/dist/index.d.ts
export type ParseLinkTypeError = ParseLinkTypeError.InvalidVersionedUri | ParseLinkTypeError.InvalidJson;

type __ParseDataTypeErrorParseVersionedUriError = ParseVersionedUriError;
declare namespace ParseDataTypeError {
    export type InvalidVersionedUri = { reason: "InvalidVersionedUri"; inner: __ParseDataTypeErrorParseVersionedUriError };
    export type InvalidJson = { reason: "InvalidJson"; inner: string };
}

export type ParseDataTypeError = ParseDataTypeError.InvalidVersionedUri | ParseDataTypeError.InvalidJson;

type __ParseEntityTypeReferenceArrayErrorParseOneOfError = ParseOneOfError;
declare namespace ParseEntityTypeReferenceArrayError {
    export type InvalidReference = { reason: "InvalidReference"; inner: __ParseEntityTypeReferenceArrayErrorParseOneOfError };
    export type InvalidJson = { reason: "InvalidJson"; inner: string };
}

export type ParseEntityTypeReferenceArrayError = ParseEntityTypeReferenceArrayError.InvalidReference | ParseEntityTypeReferenceArrayError.InvalidJson;

type __ParseLinksErrorParseEntityTypeReferenceArrayError = ParseEntityTypeReferenceArrayError;
type __ParseLinksErrorParseOneOfError = ParseOneOfError;
type __ParseLinksErrorParseVersionedUriError = ParseVersionedUriError;
type __ParseLinksErrorValidationError = ValidationError;
declare namespace ParseLinksError {
    export type InvalidLinkKey = { reason: "InvalidLinkKey"; inner: __ParseLinksErrorParseVersionedUriError };
    export type InvalidEntityTypeReference = { reason: "InvalidEntityTypeReference"; inner: __ParseLinksErrorParseOneOfError };
    export type InvalidArray = { reason: "InvalidArray"; inner: __ParseLinksErrorParseEntityTypeReferenceArrayError };
    export type InvalidRequiredKey = { reason: "InvalidRequiredKey"; inner: __ParseLinksErrorParseVersionedUriError };
    export type ValidationError = { reason: "ValidationError"; inner: __ParseLinksErrorValidationError };
    export type InvalidJson = { reason: "InvalidJson"; inner: string };
}

export type ParseLinksError = ParseLinksError.InvalidLinkKey | ParseLinksError.InvalidEntityTypeReference | ParseLinksError.InvalidArray | ParseLinksError.InvalidRequiredKey | ParseLinksError.ValidationError | ParseLinksError.InvalidJson;

export type VersionedUri = `${string}/v/${number}`;


/**
 * Checks if a given URL string is a valid base URL.
 * 
 * @param {BaseUri} uri - The URL string.
 * @returns {(Result.Ok|Result.Err<ParseBaseUriError>)} - an Ok with an inner of the string as a
 * BaseUri if valid, or an Err with an inner ParseBaseUriError  
 */
export function validateBaseUri(uri: string): Result<BaseUri, ParseBaseUriError>;



/**
 * Checks if a given URL string is a Block Protocol compliant Versioned URI.
 *
 * @param {string} uri - The URL string.
 * @returns {(Result.Ok|Result.Err<ParseVersionedUriError>)} - an Ok with an inner of the string as 
 * a VersionedUri if valid, or an Err with an inner ParseVersionedUriError  
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


type __ParseVersionedUriErrorParseBaseUriError = ParseBaseUriError;
declare namespace ParseVersionedUriError {
    export type IncorrectFormatting = { reason: "IncorrectFormatting"; inner?: null };
    export type MissingBaseUri = { reason: "MissingBaseUri"; inner?: null };
    export type MissingVersion = { reason: "MissingVersion"; inner?: null };
    export type InvalidVersion = { reason: "InvalidVersion"; inner: string };
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

export interface EntityTypeReference {
    $ref: string;
}

export interface EntityType extends Object<ValueOrArray<PropertyTypeReference>>, Links {
    kind: 'entityType';
    $id: string;
=======
export interface PropertyType extends OneOf<PropertyValues> {
    kind: 'propertyType';
    $id: VersionedUri;
>>>>>>> origin/main:packages/@blockprotocol/type-system-node/dist/index.d.ts
    title: string;
    description?: string;
}

export interface PropertyTypeReference {
    $ref: VersionedUri;
}

export type PropertyValues = DataTypeReference | Object<ValueOrArray<PropertyTypeReference>> | Array<OneOf<PropertyValues>>;

<<<<<<< HEAD:packages/@blockprotocol/type-system/dist/index.d.ts
declare namespace Result {
    export type Ok<T> = { type: "Ok"; inner: T };
    export type Err<E> = { type: "Err"; inner: E };
=======
export type VersionedUri = `${string}/v/${number}`;


/**
 * Checks if a given URL string is a valid base URL.
 * 
 * @param {BaseUri} uri - The URL string.
 * @returns {(Result.Ok|Result.Err<ParseBaseUriError>)} - an Ok with an inner of the string as a
 * BaseUri if valid, or an Err with an inner ParseBaseUriError  
 */
export function validateBaseUri(uri: string): Result<BaseUri, ParseBaseUriError>;



/**
 * Checks if a given URL string is a Block Protocol compliant Versioned URI.
 *
 * @param {string} uri - The URL string.
 * @returns {(Result.Ok|Result.Err<ParseVersionedUriError>)} - an Ok with an inner of the string as 
 * a VersionedUri if valid, or an Err with an inner ParseVersionedUriError  
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


export type MaybeOneOfEntityTypeReference = OneOf<EntityTypeReference> | {};

export type BaseUri = string;

export type ParseVersionedUriError = { reason: "IncorrectFormatting" } | { reason: "MissingBaseUri" } | { reason: "MissingVersion" } | { reason: "InvalidVersion"; inner: string } | { reason: "AdditionalEndContent" } | { reason: "InvalidBaseUri"; inner: ParseBaseUriError } | { reason: "InvalidJson"; inner: string };

export type ParseBaseUriError = { reason: "MissingTrailingSlash" } | { reason: "UrlParseError"; inner: string } | { reason: "CannotBeABase" };

export interface EntityTypeReference {
    $ref: VersionedUri;
>>>>>>> origin/main:packages/@blockprotocol/type-system-node/dist/index.d.ts
}

export interface EntityType extends AllOf<EntityTypeReference>, Object<ValueOrArray<PropertyTypeReference>>, Links {
    kind: 'entityType';
    $id: VersionedUri;
    title: string;
    description?: string;
    default?: Record<BaseUri, any>;
    examples?: Record<BaseUri, any>[];
}

export interface Links {
    links?: Record<VersionedUri, MaybeOrderedArray<MaybeOneOfEntityTypeReference>>;
    requiredLinks?: VersionedUri[];
}

export interface MaybeOrderedArray<T> extends Array<T> {
    ordered: boolean;
}

export type ParseEntityTypeReferenceArrayError = { reason: "InvalidReference"; inner: ParseOneOfError } | { reason: "InvalidJson"; inner: string };

export type ParsePropertyTypeReferenceArrayError = { reason: "InvalidReference"; inner: ParseVersionedUriError } | { reason: "InvalidJson"; inner: string };

export type ParseOneOfArrayError = { reason: "InvalidItems"; inner: ParseOneOfError } | { reason: "InvalidJson"; inner: string };

export interface AllOf<T> {
    allOf?: T[];
}

export type ValidationError = { type: "MissingRequiredProperty"; inner: BaseUri } | { type: "BaseUriMismatch"; inner: { base_uri: BaseUri; versioned_uri: VersionedUri } } | { type: "MissingRequiredLink"; inner: VersionedUri } | { type: "MismatchedPropertyCount"; inner: { actual: number; expected: number } } | { type: "EmptyOneOf" };

export type ParseOneOfError = { reason: "EntityTypeReferenceError"; inner: ParseVersionedUriError } | { reason: "PropertyValuesError"; inner: ParsePropertyTypeError } | { reason: "ValidationError"; inner: ValidationError };

export type ParseEntityTypeError = { reason: "InvalidPropertyTypeObject"; inner: ParsePropertyTypeObjectError } | { reason: "InvalidAllOf"; inner: ParseAllOfError } | { reason: "InvalidLinks"; inner: ParseLinksError } | { reason: "InvalidDefaultKey"; inner: ParseBaseUriError } | { reason: "InvalidExamplesKey"; inner: ParseBaseUriError } | { reason: "InvalidVersionedUri"; inner: ParseVersionedUriError } | { reason: "InvalidJson"; inner: string };

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

export type Result<T, E> = { type: "Ok"; inner: T } | { type: "Err"; inner: E };

export type ParsePropertyTypeObjectError = { reason: "InvalidPropertyTypeReference"; inner: ParseVersionedUriError } | { reason: "InvalidArray"; inner: ParsePropertyTypeReferenceArrayError } | { reason: "InvalidPropertyKey"; inner: ParseBaseUriError } | { reason: "InvalidRequiredKey"; inner: ParseBaseUriError } | { reason: "ValidationError"; inner: ValidationError } | { reason: "InvalidJson"; inner: string };

export type ParseAllOfError = { reason: "EntityTypeReferenceError"; inner: ParseVersionedUriError };

export type ParsePropertyTypeError = { reason: "InvalidVersionedUri"; inner: ParseVersionedUriError } | { reason: "InvalidDataTypeReference"; inner: ParseVersionedUriError } | { reason: "InvalidPropertyTypeObject"; inner: ParsePropertyTypeObjectError } | { reason: "InvalidOneOf"; inner: ParseOneOfError } | { reason: "InvalidArrayItems"; inner: ParseOneOfArrayError } | { reason: "InvalidJson"; inner: string };

