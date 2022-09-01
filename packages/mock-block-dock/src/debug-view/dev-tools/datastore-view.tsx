import { useMockBlockDockContext } from "../../mock-block-dock-context";
import { JsonView } from "./json-view";

export const DataStoreView = () => {
  const { datastore } = useMockBlockDockContext();
  return (
    <JsonView
      collapseKeys={["entities", "entityTypes", "links", "linkedAggregations"]}
      rootName="datastore"
      src={{
        entities: datastore.entities,
        entityTypes: datastore.entityTypes,
        links: datastore.links,
        linkedAggregations: datastore.linkedAggregationDefinitions,
      }}
    />
  );
};
