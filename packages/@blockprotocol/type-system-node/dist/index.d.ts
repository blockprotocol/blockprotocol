/* tslint:disable */
/* eslint-disable */
type __ValidationErrorBaseUri = BaseUri;
type __ValidationErrorVersionedUri = VersionedUri;
declare namespace ValidationError {
    export type MissingRequiredProperty = { type: "MissingRequiredProperty"; inner: __ValidationErrorBaseUri };
    export type BaseUriMismatch = { type: "BaseUriMismatch"; inner: { base_uri: __ValidationErrorBaseUri; versioned_uri: __ValidationErrorVersionedUri } };
    export type MissingRequiredRelationship = { type: "MissingRequiredRelationship"; inner: __ValidationErrorVersionedUri };
    export type MismatchedPropertyCount = { type: "MismatchedPropertyCount"; inner: { actual: number; expected: number } };
    export type EmptyOneOf = { type: "EmptyOneOf"; inner?: null };
}

export type ValidationError = ValidationError.MissingRequiredProperty | ValidationError.BaseUriMismatch | ValidationError.MissingRequiredRelationship | ValidationError.MismatchedPropertyCount | ValidationError.EmptyOneOf;

type __ParsePropertyTypeObjectErrorParseBaseUriError = ParseBaseUriError;
type __ParsePropertyTypeObjectErrorParsePropertyTypeReferenceArrayError = ParsePropertyTypeReferenceArrayError;
type __ParsePropertyTypeObjectErrorParseVersionedUriError = ParseVersionedUriError;
type __ParsePropertyTypeObjectErrorValidationError = ValidationError;
declare namespace ParsePropertyTypeObjectError {
    export type InvalidPropertyTypeReference = { reason: "InvalidPropertyTypeReference"; inner: __ParsePropertyTypeObjectErrorParseVersionedUriError };
    export type InvalidArray = { reason: "InvalidArray"; inner: __ParsePropertyTypeObjectErrorParsePropertyTypeReferenceArrayError };
    export type InvalidPropertyKey = { reason: "InvalidPropertyKey"; inner: __ParsePropertyTypeObjectErrorParseBaseUriError };
    export type InvalidRequiredKey = { reason: "InvalidRequiredKey"; inner: __ParsePropertyTypeObjectErrorParseBaseUriError };
    export type ValidationError = { reason: "ValidationError"; inner: __ParsePropertyTypeObjectErrorValidationError };
    export type InvalidJson = { reason: "InvalidJson"; inner: string };
}

export type ParsePropertyTypeObjectError = ParsePropertyTypeObjectError.InvalidPropertyTypeReference | ParsePropertyTypeObjectError.InvalidArray | ParsePropertyTypeObjectError.InvalidPropertyKey | ParsePropertyTypeObjectError.InvalidRequiredKey | ParsePropertyTypeObjectError.ValidationError | ParsePropertyTypeObjectError.InvalidJson;

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

export interface Relationships {
    relationships?: Record<string, MaybeOrderedArray<OneOf<EntityTypeReference>>>;
    requiredRelationships?: string[];
}

export interface MaybeOrderedArray<T> extends Array<T> {
    ordered?: boolean;
}

export interface OneOf<T> {
    oneOf: T[];
}

export interface Object<T> {
    type: 'object';
    properties: Record<string, T>;
    required?: string[];
}

type __ParseAllOfErrorParseVersionedUriError = ParseVersionedUriError;
declare namespace ParseAllOfError {
    export type EntityTypeReferenceError = { reason: "EntityTypeReferenceError"; inner: __ParseAllOfErrorParseVersionedUriError };
}

export type ParseAllOfError = ParseAllOfError.EntityTypeReferenceError;

type __ParsePropertyTypeErrorParseOneOfArrayError = ParseOneOfArrayError;
type __ParsePropertyTypeErrorParseOneOfError = ParseOneOfError;
type __ParsePropertyTypeErrorParsePropertyTypeObjectError = ParsePropertyTypeObjectError;
type __ParsePropertyTypeErrorParseVersionedUriError = ParseVersionedUriError;
declare namespace ParsePropertyTypeError {
    export type InvalidVersionedUri = { reason: "InvalidVersionedUri"; inner: __ParsePropertyTypeErrorParseVersionedUriError };
    export type InvalidDataTypeReference = { reason: "InvalidDataTypeReference"; inner: __ParsePropertyTypeErrorParseVersionedUriError };
    export type InvalidPropertyTypeObject = { reason: "InvalidPropertyTypeObject"; inner: __ParsePropertyTypeErrorParsePropertyTypeObjectError };
    export type InvalidOneOf = { reason: "InvalidOneOf"; inner: __ParsePropertyTypeErrorParseOneOfError };
    export type InvalidArrayItems = { reason: "InvalidArrayItems"; inner: __ParsePropertyTypeErrorParseOneOfArrayError };
    export type InvalidJson = { reason: "InvalidJson"; inner: string };
}

export type ParsePropertyTypeError = ParsePropertyTypeError.InvalidVersionedUri | ParsePropertyTypeError.InvalidDataTypeReference | ParsePropertyTypeError.InvalidPropertyTypeObject | ParsePropertyTypeError.InvalidOneOf | ParsePropertyTypeError.InvalidArrayItems | ParsePropertyTypeError.InvalidJson;

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


/**
 * Checks if a given Link Type is correctly formed
 *
 * @param {LinkType} linkType - The Link Type object to validate.
 * @returns {(Result.Ok|Result.Err<ParseLinkTypeError>)} - an Ok with null inner if valid, or an Err with an inner ParseLinkTypeError  
 */
export function validateLinkType(linkType: LinkType): Result<undefined, ParseLinkTypeError>;



/**
 * Checks if a given Property Type is correctly formed
 *
 * @param {PropertyType} propertyType - The Property Type object to validate.
 * @returns {(Result.Ok|Result.Err<ParsePropertyTypeError>)} - an Ok with null inner if valid, or an Err with an inner ParsePropertyTypeError  
 */
export function validatePropertyType(propertyType: PropertyType): Result<undefined, ParsePropertyTypeError>;


type __ParseRelationshipsErrorParseEntityTypeReferenceArrayError = ParseEntityTypeReferenceArrayError;
type __ParseRelationshipsErrorParseVersionedUriError = ParseVersionedUriError;
type __ParseRelationshipsErrorValidationError = ValidationError;
declare namespace ParseRelationshipsError {
    export type InvalidRelationshipKey = { reason: "InvalidRelationshipKey"; inner: __ParseRelationshipsErrorParseVersionedUriError };
    export type InvalidArray = { reason: "InvalidArray"; inner: __ParseRelationshipsErrorParseEntityTypeReferenceArrayError };
    export type InvalidRequiredKey = { reason: "InvalidRequiredKey"; inner: __ParseRelationshipsErrorParseVersionedUriError };
    export type ValidationError = { reason: "ValidationError"; inner: __ParseRelationshipsErrorValidationError };
    export type InvalidJson = { reason: "InvalidJson"; inner: string };
}

export type ParseRelationshipsError = ParseRelationshipsError.InvalidRelationshipKey | ParseRelationshipsError.InvalidArray | ParseRelationshipsError.InvalidRequiredKey | ParseRelationshipsError.ValidationError | ParseRelationshipsError.InvalidJson;


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

type __ParseLinkTypeErrorParseVersionedUriError = ParseVersionedUriError;
declare namespace ParseLinkTypeError {
    export type InvalidVersionedUri = { reason: "InvalidVersionedUri"; inner: __ParseLinkTypeErrorParseVersionedUriError };
    export type InvalidJson = { reason: "InvalidJson"; inner: string };
}

export type ParseLinkTypeError = ParseLinkTypeError.InvalidVersionedUri | ParseLinkTypeError.InvalidJson;

export interface LinkType {
    kind: 'linkType';
    $id: string;
    title: string;
    pluralTitle: string;
    description: string;
    relatedKeywords?: string[];
}

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


export type BaseUri = string;

type __ParseDataTypeErrorParseVersionedUriError = ParseVersionedUriError;
declare namespace ParseDataTypeError {
    export type InvalidVersionedUri = { reason: "InvalidVersionedUri"; inner: __ParseDataTypeErrorParseVersionedUriError };
    export type InvalidJson = { reason: "InvalidJson"; inner: string };
}

export type ParseDataTypeError = ParseDataTypeError.InvalidVersionedUri | ParseDataTypeError.InvalidJson;

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

export interface EntityType extends AllOf<EntityTypeReference>, Object<ValueOrArray<PropertyTypeReference>>, Relationships {
    kind: 'entityType';
    $id: string;
    title: string;
    pluralTitle: string;
    description?: string;
    default?: Record<BaseUri, any>;
    examples?: Record<BaseUri, any>[];
}

type __ParseEntityTypeReferenceArrayErrorParseOneOfError = ParseOneOfError;
declare namespace ParseEntityTypeReferenceArrayError {
    export type InvalidReference = { reason: "InvalidReference"; inner: __ParseEntityTypeReferenceArrayErrorParseOneOfError };
    export type InvalidJson = { reason: "InvalidJson"; inner: string };
}

export type ParseEntityTypeReferenceArrayError = ParseEntityTypeReferenceArrayError.InvalidReference | ParseEntityTypeReferenceArrayError.InvalidJson;

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

export interface AllOf<T> {
    allOf?: T[];
}

declare namespace Result {
    export type Ok<T> = { type: "Ok"; inner: T };
    export type Err<E> = { type: "Err"; inner: E };
}

export type Result<T, E> = Result.Ok<T> | Result.Err<E>;

type __ParseOneOfErrorParsePropertyTypeError = ParsePropertyTypeError;
type __ParseOneOfErrorParseVersionedUriError = ParseVersionedUriError;
type __ParseOneOfErrorValidationError = ValidationError;
declare namespace ParseOneOfError {
    export type EntityTypeReferenceError = { reason: "EntityTypeReferenceError"; inner: __ParseOneOfErrorParseVersionedUriError };
    export type PropertyValuesError = { reason: "PropertyValuesError"; inner: __ParseOneOfErrorParsePropertyTypeError };
    export type ValidationError = { reason: "ValidationError"; inner: __ParseOneOfErrorValidationError };
}

export type ParseOneOfError = ParseOneOfError.EntityTypeReferenceError | ParseOneOfError.PropertyValuesError | ParseOneOfError.ValidationError;

type __ParseEntityTypeErrorParseAllOfError = ParseAllOfError;
type __ParseEntityTypeErrorParseBaseUriError = ParseBaseUriError;
type __ParseEntityTypeErrorParsePropertyTypeObjectError = ParsePropertyTypeObjectError;
type __ParseEntityTypeErrorParseRelationshipsError = ParseRelationshipsError;
type __ParseEntityTypeErrorParseVersionedUriError = ParseVersionedUriError;
declare namespace ParseEntityTypeError {
    export type InvalidPropertyTypeObject = { reason: "InvalidPropertyTypeObject"; inner: __ParseEntityTypeErrorParsePropertyTypeObjectError };
    export type InvalidAllOf = { reason: "InvalidAllOf"; inner: __ParseEntityTypeErrorParseAllOfError };
    export type InvalidRelationships = { reason: "InvalidRelationships"; inner: __ParseEntityTypeErrorParseRelationshipsError };
    export type InvalidDefaultKey = { reason: "InvalidDefaultKey"; inner: __ParseEntityTypeErrorParseBaseUriError };
    export type InvalidExamplesKey = { reason: "InvalidExamplesKey"; inner: __ParseEntityTypeErrorParseBaseUriError };
    export type InvalidVersionedUri = { reason: "InvalidVersionedUri"; inner: __ParseEntityTypeErrorParseVersionedUriError };
    export type InvalidJson = { reason: "InvalidJson"; inner: string };
}

export type ParseEntityTypeError = ParseEntityTypeError.InvalidPropertyTypeObject | ParseEntityTypeError.InvalidAllOf | ParseEntityTypeError.InvalidRelationships | ParseEntityTypeError.InvalidDefaultKey | ParseEntityTypeError.InvalidExamplesKey | ParseEntityTypeError.InvalidVersionedUri | ParseEntityTypeError.InvalidJson;

