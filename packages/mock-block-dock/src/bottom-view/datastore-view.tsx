import { JsonView } from "../json-view";
import { MockData } from "../use-mock-block-props/use-mock-datastore";

type Props = {
  datastore: MockData;
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
