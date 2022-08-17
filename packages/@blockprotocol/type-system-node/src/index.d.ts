/* tslint:disable */
/* eslint-disable */
/**
*/
export class BaseUri {
  free(): void;
/**
* @param {string} uri
*/
  constructor(uri: string);
/**
* @returns {string}
*/
  toString(): string;
/**
* @returns {any}
*/
  toJSON(): any;
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
export class VersionedUri {
  free(): void;
/**
* Creates a new `VersionedUri` from the given `base_uri` and `version`.
* @param {BaseUri} base_uri
* @param {number} version
*/
  constructor(base_uri: BaseUri, version: number);
/**
* @returns {string}
*/
  toString(): string;
/**
* @returns {any}
*/
  toJSON(): any;
/**
*/
  readonly baseUri: BaseUri;
/**
*/
  readonly version: number;
}
