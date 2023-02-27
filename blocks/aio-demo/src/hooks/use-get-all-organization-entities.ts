import { GraphBlockHandler } from "@blockprotocol/graph";
import { getRoots } from "@blockprotocol/graph/stdlib";
import { useEffect, useState } from "react";

import { useRefreshDataContext } from "../contexts/refresh-data";
import { entityTypeIdIsFilter } from "../shared/query-filters";
import { organizationNamePath } from "../shared/query-paths";
import { entityTypeIds, Organization } from "../types/entity-types";

export const useGetAllOrganizationEntities = (
  graphModule: GraphBlockHandler,
): Organization[] | null => {
  const { refreshSignal } = useRefreshDataContext();

  const [organizationEntities, setOrganizationEntities] = useState<
    Organization[] | null
  >(null);

  useEffect(() => {
    void (async () => {
      const { data, errors } = await graphModule.queryEntities({
        data: {
          operation: {
            multiFilter: {
              filters: [entityTypeIdIsFilter(entityTypeIds.organization)],
              operator: "AND",
            },
            multiSort: [
              {
                field: organizationNamePath,
              },
            ],
          },
        },
      });

      if (!data) {
        throw new Error(
          `No data in \`queryEntities\` response: ${JSON.stringify(
            errors,
            null,
            2,
          )}`,
        );
      }

      const { results: entitySubgraph } = data;

      const roots = getRoots(entitySubgraph);

      setOrganizationEntities(roots as Organization[]);
    })();
  }, [graphModule, refreshSignal]);

  return organizationEntities;
};
