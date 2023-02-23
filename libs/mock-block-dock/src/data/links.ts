import { Link } from "@blockprotocol/graph";

import { entities } from "./entities";

const createLink = (
  sourceEntityId: string,
  destinationEntityId: string,
  path: string,
): Link => {
  return {
    linkId: `${sourceEntityId}-works-for-${destinationEntityId}`,
    sourceEntityId,
    destinationEntityId,
    path,
  };
};

const peopleEntities = entities.filter(
  ({ entityTypeId }) => entityTypeId === "Person",
);

const companyEntities = entities.filter(
  ({ entityTypeId }) => entityTypeId === "Company",
);

const personToCompanyPossibleLinkPaths = ["$.founderOf", "$.worksFor"];

export const links = peopleEntities.map(({ entityId: sourceEntityId }) =>
  createLink(
    sourceEntityId,
    companyEntities[Math.floor(Math.random() * companyEntities.length)]!
      .entityId,
    personToCompanyPossibleLinkPaths[
      Math.floor(Math.random() * personToCompanyPossibleLinkPaths.length)
    ]!,
  ),
);
