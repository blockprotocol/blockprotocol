import { DataType } from "@blockprotocol/type-system/slim";

import { OntologyElementMetadata } from "./metadata.js";

export type DataTypeWithMetadata = {
  schema: DataType;
  metadata: OntologyElementMetadata;
};
