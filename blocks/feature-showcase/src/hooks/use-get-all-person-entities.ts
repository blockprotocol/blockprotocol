import { GraphBlockHandler } from "@blockprotocol/graph";
import { getRoots } from "@blockprotocol/graph/stdlib";
import { useEffect, useState } from "react";

import { useRefreshDataContext } from "../contexts/refresh-data";
import { entityTypeIdIsFilter } from "../shared/query-filters";
import { personNamePath } from "../shared/query-paths";
import { entityTypeIds, Person } from "../types/entity-types";

export const useGetAllPersonEntities = (
  graphModule: GraphBlockHandler,
): Person[] | null => {
  const { refreshSignal } = useRefreshDataContext();

  const [personEntities, setPersonEntities] = useState<Person[] | null>(null);

  useEffect(() => {
    void (async () => {
      const { data, errors } = await graphModule.queryEntities({
        data: {
          operation: {
            multiFilter: {
              filters: [entityTypeIdIsFilter(entityTypeIds.person)],
              operator: "AND",
            },
            multiSort: [
              {
                field: personNamePath,
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

      setPersonEntities(roots as Person[]);
    })();
  }, [graphModule, refreshSignal]);

  return personEntities;
};
