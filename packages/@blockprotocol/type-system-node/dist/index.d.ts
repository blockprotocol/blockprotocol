/* tslint:disable */
/* eslint-disable */
/**
* Takes a URL string and attempts to parse it into a valid URL, returning it in standardized form
* @param {string} uri
* @returns {string}
*/
export function parseBaseUri(uri: string): string;
/**
* Checks if a given URL string is a Block Protocol compliant Versioned URI.
*
* If the URL is valid this function returns nothing, otherwise it throws a
* `ParseVersionedUriError`
* @param {string} uri
*/
export function isValidVersionedUri(uri: string): void;
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
