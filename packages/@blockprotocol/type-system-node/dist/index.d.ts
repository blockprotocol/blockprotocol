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

export type ValueOrArray<T> = T | Array<T>;

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



/**
 * Checks if a given Property Type is correctly formed
 *
 * @param {PropertyType} propertyType - The Property Type object to validate.
 * @returns {(Result.Ok|Result.Err<ParsePropertyTypeError>)} - an Ok with null inner if valid, or an Err with an inner ParsePropertyTypeError  
 */
export function validatePropertyType(propertyType: PropertyType): Result<undefined, ParsePropertyTypeError>;


export type ParseLinksError = { reason: "InvalidLinkKey"; inner: ParseVersionedUriError } | { reason: "InvalidArray"; inner: ParseEntityTypeReferenceArrayError } | { reason: "InvalidRequiredKey"; inner: ParseVersionedUriError } | { reason: "ValidationError"; inner: ValidationError } | { reason: "InvalidJson"; inner: string };

export type ParseDataTypeError = { reason: "InvalidVersionedUri"; inner: ParseVersionedUriError } | { reason: "InvalidJson"; inner: string };

export interface PropertyType extends OneOf<PropertyValues> {
    kind: 'propertyType';
    $id: VersionedUri;
    title: string;
    description?: string;
}

export interface PropertyTypeReference {
    $ref: VersionedUri;
}

export type PropertyValues = DataTypeReference | Object<ValueOrArray<PropertyTypeReference>> | Array<OneOf<PropertyValues>>;

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

