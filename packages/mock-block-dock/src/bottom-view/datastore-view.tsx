import { JsonView } from "../json-view";
import { useMockBlockDockContext } from "../mock-block-dock-context";

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
