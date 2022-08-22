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
