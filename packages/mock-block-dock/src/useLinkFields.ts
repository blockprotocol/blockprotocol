import {
  BlockProtocolEntity,
  BlockProtocolLink,
  BlockProtocolLinkedAggregation,
  BlockProtocolLinkGroup,
  BlockProtocolProps,
} from "blockprotocol";
import { useMemo } from "react";
import { filterAndSortEntitiesOrTypes, matchIdentifiers } from "./util";

type LinkFields = {
  linkedAggregations: BlockProtocolProps["linkedAggregations"];
  linkedEntities: BlockProtocolProps["linkedEntities"];
  linkGroups: BlockProtocolLinkGroup[];
};

export const useLinkFields = ({
  entities,
  links,
  startingEntity,
}: {
  depth?: number;
  entities: BlockProtocolEntity[];
  links: BlockProtocolLink[];
  startingEntity: BlockProtocolEntity;
}): LinkFields => {
  // @todo optionally resolve to further depth, i.e. follow links from linked entities
  const { linkedAggregations, linkedEntities, linkGroups } = useMemo(() => {
    const linksFromStartingEntity = links.filter(
      ({ sourceAccountId, sourceEntityId, sourceEntityTypeId }) =>
        matchIdentifiers(
          {
            accountId: sourceAccountId,
            entityId: sourceEntityId,
            entityTypeId: sourceEntityTypeId,
          },
          startingEntity,
        ),
    );

    const calculatedLinkGroups = linksFromStartingEntity.reduce<
      BlockProtocolLinkGroup[]
    >((linkGroupsAcc, link) => {
      if ("operation" in link) {
        /**
         * this is an aggregation link - they don't go in linkGroups,
         * because they are in linkedAggregations
         * @todo should they be in linkGroups too?
         * */
        return linkGroupsAcc;
      }
      const existingGroup = linkGroupsAcc.find(
        (group) =>
          matchIdentifiers(
            {
              accountId: link.sourceAccountId,
              entityId: link.sourceEntityId,
              entityTypeId: link.sourceEntityTypeId,
            },
            {
              accountId: group.sourceAccountId,
              entityId: group.sourceEntityId,
              entityTypeId: group.sourceEntityTypeId,
            },
          ) && link.path === group.path,
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
      linksFromStartingEntity.find(
        (link) =>
          "destinationEntityId" in link &&
          matchIdentifiers(
            {
              accountId: link.destinationAccountId,
              entityId: link.destinationEntityId,
              entityTypeId: link.destinationEntityTypeId,
            },
            entity,
          ),
      ),
    );

    const calculatedLinkedAggregations: BlockProtocolLinkedAggregation[] =
      linksFromStartingEntity
        .map((link) => {
          if (!("operation" in link)) {
            return null;
          }
          const results = filterAndSortEntitiesOrTypes(entities, {
            operation: link.operation,
          });
          return {
            ...link,
            ...results,
          };
        })
        .filter(
          (thing): thing is Exclude<typeof thing, null> => thing !== null,
        );

    return {
      linkedAggregations: calculatedLinkedAggregations,
      linkedEntities: calculatedLinkedEntities,
      linkGroups: calculatedLinkGroups,
    };
  }, [entities, links, startingEntity]);

  return {
    linkedAggregations,
    linkGroups,
    linkedEntities,
  };
};
