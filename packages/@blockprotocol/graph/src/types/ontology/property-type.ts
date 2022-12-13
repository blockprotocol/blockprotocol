import { PropertyType } from "@blockprotocol/type-system/slim";

import { OntologyElementMetadata } from "./metadata.js";

/**
 * @todo - Should we re-export this? Should the type-system package be an implementation detail of the graph service?
 *   Or should consumers import it directly? Also raises the question of if we should be re-exporting the functions.
 */
export type { PropertyType };

export type PropertyTypeWithMetadata = {
  schema: PropertyType;
  metadata: OntologyElementMetadata;
};
