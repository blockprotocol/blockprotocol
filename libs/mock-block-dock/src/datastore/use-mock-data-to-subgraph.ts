import {
  extractBaseUrl,
  extractVersion,
  Subgraph as SubgraphNonTemporal,
} from "@blockprotocol/graph";
import { buildSubgraph as buildSubgraphNonTemporal } from "@blockprotocol/graph/stdlib";
import { Subgraph as SubgraphTemporal } from "@blockprotocol/graph/temporal";
import { buildSubgraph as buildSubgraphTemporal } from "@blockprotocol/graph/temporal/stdlib";
import { useMemo } from "react";

import { entityTypes } from "../data/entity-types";
import { isTemporalMockData, MockData } from "./mock-data";

export const useMockDataToSubgraph = <Temporal>(
  mockData: MockData<Temporal>,
): Temporal extends true ? SubgraphTemporal : SubgraphNonTemporal => {
  return useMemo(() => {
    if (isTemporalMockData(mockData)) {
      const { entities, subgraphTemporalAxes } = mockData;

      /** @todo - accept ontology elements within the MBD datastore */
      return buildSubgraphTemporal(
        {
          dataTypes: [],
          propertyTypes: [],
          entityTypes: Object.values(entityTypes).map((schema) => {
            const baseUrl = extractBaseUrl(schema.$id);
            const version = extractVersion(schema.$id);
            return {
              metadata: { recordId: { baseUrl, version } },
              schema,
            };
          }),
          entities,
        },
        [],
        {
          hasLeftEntity: { incoming: 255, outgoing: 255 },
          hasRightEntity: { incoming: 255, outgoing: 255 },
          constrainsLinkDestinationsOn: { outgoing: 255 },
          constrainsLinksOn: { outgoing: 255 },
          constrainsPropertiesOn: { outgoing: 255 },
          constrainsValuesOn: { outgoing: 255 },
          inheritsFrom: { outgoing: 255 },
          isOfType: { outgoing: 255 },
        },
        subgraphTemporalAxes,
      ) as Temporal extends true ? SubgraphTemporal : SubgraphNonTemporal;
    } else {
      const { entities } = mockData;

      /** @todo - accept ontology elements within the MBD datastore */
      return buildSubgraphNonTemporal(
        {
          dataTypes: [],
          propertyTypes: [],
          entityTypes: Object.values(entityTypes).map((schema) => {
            const baseUrl = extractBaseUrl(schema.$id);
            const version = extractVersion(schema.$id);
            return {
              metadata: { recordId: { baseUrl, version } },
              schema,
            };
          }),
          entities,
        },
        [],
        {
          hasLeftEntity: { incoming: 255, outgoing: 255 },
          hasRightEntity: { incoming: 255, outgoing: 255 },
          constrainsLinkDestinationsOn: { outgoing: 255 },
          constrainsLinksOn: { outgoing: 255 },
          constrainsPropertiesOn: { outgoing: 255 },
          constrainsValuesOn: { outgoing: 255 },
          inheritsFrom: { outgoing: 255 },
          isOfType: { outgoing: 255 },
        },
      ) as Temporal extends true ? SubgraphTemporal : SubgraphNonTemporal;
    }
  }, [mockData]);
};
