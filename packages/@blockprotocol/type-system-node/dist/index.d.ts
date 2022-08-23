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
    $ref: `${string}/v/${number}`;
}

export interface DataType extends Record<string, any> {
    kind: 'dataType';
    $id: `${string}/v/${number}`;
    title: string;
    description?: string;
    type: string;
}

export type BaseUri = string;

export interface PropertyTypeReference {
    $ref: `${string}/v/${number}`;
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
    $id: `${string}/v/${number}`;
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
