/* tslint:disable */
/* eslint-disable */
/**
* @param {string} uri
* @returns {string}
*/
export function parseBaseUri(uri: string): string;
/**
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
