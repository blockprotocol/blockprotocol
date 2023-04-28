import { Entity, GraphBlockHandler } from "@blockprotocol/graph";
import { getRoots } from "@blockprotocol/graph/stdlib";
import { useEffect, useState } from "react";

import { useRefreshDataContext } from "../contexts/refresh-data";
import { companyNamePath, personNamePath } from "../shared/query-paths";

export const useGetAllEntities = (
  graphModule: GraphBlockHandler,
): Entity[] | null => {
  const { refreshSignal } = useRefreshDataContext();

  const [entities, setEntities] = useState<Entity[] | null>(null);

  useEffect(() => {
    void (async () => {
      const { data, errors } = await graphModule.queryEntities({
        data: {
          operation: {
            multiSort: [
              // Filter by the name (if there is a name)
              {
                field: personNamePath,
              },
              {
                field: companyNamePath,
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

      setEntities(roots);
    })();
  }, [graphModule, refreshSignal]);

  return entities;
};
