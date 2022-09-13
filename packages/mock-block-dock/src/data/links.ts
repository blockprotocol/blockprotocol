import { Link } from "@blockprotocol/graph";

import { entities } from "./entities";

const createWorksForLink = (
  sourceEntityId: string,
  destinationEntityId: string,
): Link => {
  return {
    linkId: `${sourceEntityId}-works-for-${destinationEntityId}`,
    sourceEntityId,
    destinationEntityId,
    path: "$.worksFor",
  };
};

const peopleEntities = entities.filter(
  ({ entityTypeId }) => entityTypeId === "Person",
);

const companyEntities = entities.filter(
  ({ entityTypeId }) => entityTypeId === "Company",
);

export const links = peopleEntities.map(({ entityId: sourceEntityId }) =>
  createWorksForLink(
    sourceEntityId,
    companyEntities[Math.floor(Math.random() * companyEntities.length)]!
      .entityId,
  ),
);
