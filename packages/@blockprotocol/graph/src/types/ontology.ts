import { BaseUri } from "@blockprotocol/type-system/dist/cjs-slim/index-slim";
import { validateBaseUri } from "@blockprotocol/type-system/wasm/type-system";

export * from "./ontology/data-type";
export * from "./ontology/entity-type";
export * from "./ontology/metadata";
export * from "./ontology/property-type";

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

export const isOntologyTypeEditionId = (
  editionId: unknown,
): editionId is OntologyTypeEditionId => {
  return (
    editionId != null &&
    typeof editionId === "object" &&
    "baseId" in editionId &&
    typeof editionId.baseId === "string" &&
    /** @todo - This means we need to have initialized the type system */
    validateBaseUri(editionId.baseId).type === "Ok" &&
    "versionId" in editionId &&
    typeof editionId.versionId === "number"
  );
};
