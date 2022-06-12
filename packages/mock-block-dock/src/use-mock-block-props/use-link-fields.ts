import {
  BlockGraph,
  Entity,
  Link,
  LinkedAggregation,
  LinkedAggregationDefinition,
  LinkGroup,
} from "@blockprotocol/graph";
import { useMemo } from "react";

import { filterAndSortEntitiesOrTypes } from "../util";

type LinkFields = {
  blockGraph: BlockGraph;
  linkedAggregations: LinkedAggregation[];
};

export const useLinkFields = ({
  entities,
  links,
  linkedAggregationDefinitions,
  startingEntity,
}: {
  entities: Entity[];
  links: Link[];
  linkedAggregationDefinitions: LinkedAggregationDefinition[];
  startingEntity: Entity;
}): LinkFields => {
  // @todo optionally resolve to further depth, i.e. follow links from linked entities
  const { resolvedLinkedAggregations, linkedEntities, linkGroups } =
    useMemo(() => {
      const linksFromStartingEntity = links.filter(
        ({ sourceEntityId }) => sourceEntityId === startingEntity.entityId,
      );

      const calculatedLinkGroups = linksFromStartingEntity.reduce<LinkGroup[]>(
        (linkGroupsAcc, link) => {
          const existingGroup = linkGroupsAcc.find(
            (group) =>
              link.sourceEntityId === group.sourceEntityId &&
              link.path === group.path,
          );
          if (existingGroup) {
            existingGroup.links.push(link);
          } else {
            linkGroupsAcc.push({
              sourceEntityId: link.sourceEntityId,
              links: [link],
              path: link.path,
            });
          }
          return linkGroupsAcc;
        },
        [],
      );

      const calculatedLinkedEntities = entities.filter((entity) =>
        linksFromStartingEntity.find(
          (link) => link.destinationEntityId === entity.entityId,
        ),
      );

      const calculatedLinkedAggregations: LinkedAggregation[] =
        linkedAggregationDefinitions
          .map((linkedAggregation) => {
            const isLinkedFromStartingEntity =
              startingEntity.entityId === linkedAggregation.sourceEntityId;
            if (!isLinkedFromStartingEntity) {
              return null;
            }
            const results = filterAndSortEntitiesOrTypes(
              entities,
              linkedAggregation,
            );
            return {
              ...linkedAggregation,
              ...results,
            };
          })
          .filter(
            (thing): thing is Exclude<typeof thing, null> => thing !== null,
          );

      return {
        resolvedLinkedAggregations: calculatedLinkedAggregations,
        linkedEntities: calculatedLinkedEntities,
        linkGroups: calculatedLinkGroups,
      };
    }, [entities, links, linkedAggregationDefinitions, startingEntity]);

  const blockGraph = useMemo<BlockGraph>(
    () => ({
      depth: 1,
      linkGroups,
      linkedEntities,
    }),
    [linkedEntities, linkGroups],
  );

  return {
    blockGraph,
    linkedAggregations: resolvedLinkedAggregations,
  };
};
