import { MultiFilter, VersionedUrl } from "@blockprotocol/graph";

import { entityEntityTypeIdPath } from "./query-paths";

export const entityTypeIdIsFilter = (
  entityTypeId: VersionedUrl,
): MultiFilter["filters"][number] => {
  return {
    field: entityEntityTypeIdPath,
    operator: "EQUALS",
    value: entityTypeId,
  };
};
