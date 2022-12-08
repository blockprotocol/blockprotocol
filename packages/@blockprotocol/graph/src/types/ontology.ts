import { BaseUri } from "@blockprotocol/type-system/dist/cjs-slim/index-slim";

export * from "./ontology/entity-type";
/** @todo - Add documentation */
/**
 *  @todo - Do we want to introduce "ontology" into code? Alternatives:
 *    * `TypeEditionId` - "type" is so ambiguous in languages and tends to clash with protected keywords
 *    * `TypeSystemElementId` - This is about as wordy as below, and is an element of the ontology the same as an element
 *      of the type system? Not sure the type system == ontology, it's more like the type system describes the ontology.
 */
export type OntologyTypeEditionId = {
  baseId: BaseUri;
  versionId: number;
};
