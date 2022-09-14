import { useMockBlockDockContext } from "../../mock-block-dock-context";
import { DatastoreGraphVisualisation } from "./datastore-graph-visualisation";
import { JsonView } from "./json-view";

export const DataStoreView = () => {
  const { datastore } = useMockBlockDockContext();
  return (
    <>
      <DatastoreGraphVisualisation />
      <JsonView
        collapseKeys={[
          "entities",
          "entityTypes",
          "links",
          "linkedAggregations",
        ]}
        rootName="datastore"
        src={{
          entities: datastore.entities,
          entityTypes: datastore.entityTypes,
          links: datastore.links,
          linkedAggregations: datastore.linkedAggregationDefinitions,
        }}
      />
    </>
  );
};
