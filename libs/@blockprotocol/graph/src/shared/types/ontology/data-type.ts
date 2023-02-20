import { DataType } from "@blockprotocol/type-system/slim";

import { OntologyElementMetadata } from "./metadata.js";

/**
 * @todo - Should we re-export this? Should the type-system package be an implementation detail of the graph module?
 *   Or should consumers import it directly? Also raises the question of if we should be re-exporting the functions.
 */
export type { DataType };

export type DataTypeWithMetadata = {
  schema: DataType;
  metadata: OntologyElementMetadata;
};
