import { GraphBlockHandler } from "@blockprotocol/graph";
import { getRoots } from "@blockprotocol/graph/stdlib";
import { useEffect, useState } from "react";

import { useRefreshDataContext } from "../contexts/refresh-data";
import { entityTypeIdIsFilter } from "../shared/query-filters";
import { companyNamePath } from "../shared/query-paths";
import { Company, entityTypeIds } from "../types/entity-types";

export const useGetAllCompanyEntities = (
  graphModule: GraphBlockHandler,
): Company[] | null => {
  const { refreshSignal } = useRefreshDataContext();

  const [companyEntities, setCompanyEntities] = useState<Company[] | null>(
    null,
  );

  useEffect(() => {
    void (async () => {
      const { data, errors } = await graphModule.queryEntities({
        data: {
          operation: {
            multiFilter: {
              filters: [entityTypeIdIsFilter(entityTypeIds.company)],
              operator: "AND",
            },
            multiSort: [
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

      setCompanyEntities(roots as Company[]);
    })();
  }, [graphModule, refreshSignal]);

  return companyEntities;
};
