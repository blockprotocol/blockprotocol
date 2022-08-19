import { JsonView } from "../json-view";

type Props = {
  datastore: any; // fix types
};

export const DataStoreView = ({ datastore }: Props) => {
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
