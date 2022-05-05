import {
  BlockProtocolEntity,
  BlockProtocolLink,
  BlockProtocolLinkedAggregation,
  BlockProtocolLinkedAggregationDefinition,
  BlockProtocolLinkGroup,
  BlockProtocolProps,
} from "blockprotocol";
import { useMemo } from "react";

import { filterAndSortEntitiesOrTypes, matchEntityIdentifiers } from "./util";

type LinkFields = {
  linkedAggregations: BlockProtocolProps["linkedAggregations"];
  linkedEntities: BlockProtocolProps["linkedEntities"];
  linkGroups: BlockProtocolLinkGroup[];
};

export const useLinkFields = ({
  entities,
  links,
  linkedAggregationDefinitions,
  startingEntity,
}: {
  depth?: number;
  entities: BlockProtocolEntity[];
  links: BlockProtocolLink[];
  linkedAggregationDefinitions: BlockProtocolLinkedAggregationDefinition[];
  startingEntity: BlockProtocolEntity;
}): LinkFields => {
  // @todo optionally resolve to further depth, i.e. follow links from linked entities
  const { resolvedLinkedAggregations, linkedEntities, linkGroups } =
    useMemo(() => {
      const linksFromStartingEntity = links.filter(
        ({ sourceAccountId, sourceEntityId, sourceEntityTypeId }) =>
          matchEntityIdentifiers({
            providedIdentifiers: {
              accountId: sourceAccountId,
              entityId: sourceEntityId,
              entityTypeId: sourceEntityTypeId,
            },
            entityToCheck: startingEntity,
          }),
      );

      const calculatedLinkGroups = linksFromStartingEntity.reduce<
        BlockProtocolLinkGroup[]
      >((linkGroupsAcc, link) => {
        const existingGroup = linkGroupsAcc.find(
          (group) =>
            matchEntityIdentifiers({
              providedIdentifiers: {
                accountId: link.sourceAccountId,
                entityId: link.sourceEntityId,
                entityTypeId: link.sourceEntityTypeId,
              },
              entityToCheck: {
                accountId: group.sourceAccountId,
                entityId: group.sourceEntityId,
                entityTypeId: group.sourceEntityTypeId,
              },
            }) && link.path === group.path,
        );
        if (existingGroup) {
          existingGroup.links.push(link);
        } else {
          linkGroupsAcc.push({
            sourceAccountId: link.sourceAccountId,
            sourceEntityId: link.sourceEntityId,
            sourceEntityTypeId: link.sourceEntityTypeId,
            links: [link],
            path: link.path,
          });
        }
        return linkGroupsAcc;
      }, []);

      const calculatedLinkedEntities = entities.filter((entity) =>
        linksFromStartingEntity.find((link) =>
          matchEntityIdentifiers({
            providedIdentifiers: {
              accountId: link.destinationAccountId,
              entityId: link.destinationEntityId,
              entityTypeId: link.destinationEntityTypeId,
            },
            entityToCheck: entity,
          }),
        ),
      );

      const calculatedLinkedAggregations: BlockProtocolLinkedAggregation[] =
        linkedAggregationDefinitions
          .map((linkedAggregation) => {
            const isLinkedFromStartingEntity = matchEntityIdentifiers({
              providedIdentifiers: {
                accountId: linkedAggregation.sourceAccountId,
                entityId: linkedAggregation.sourceEntityId,
                entityTypeId: linkedAggregation.sourceEntityTypeId,
              },
              entityToCheck: startingEntity,
            });
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

  return {
    linkedAggregations: resolvedLinkedAggregations,
    linkGroups,
    linkedEntities,
  };
};
