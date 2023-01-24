import { OntologyTypeEditionId } from "../ontology.js";

export interface OntologyElementMetadata {
  editionId: OntologyTypeEditionId;
  ownedById: string;
}
