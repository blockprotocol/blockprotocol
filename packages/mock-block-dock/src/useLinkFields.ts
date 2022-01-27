import {
  BlockProtocolEntity,
  BlockProtocolLink,
  BlockProtocolLinkGroup,
  BlockProtocolProps,
} from "blockprotocol";
import { useMemo } from "react";
import { matchIdentifiers } from "./util";

type LinkFields = {
  linkGroups: BlockProtocolLinkGroup[];
  linkedEntities: BlockProtocolProps["linkedEntities"];
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
  const { linkGroups, linkedEntities } = useMemo(() => {
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

    return {
      linkGroups: calculatedLinkGroups,
      linkedEntities: calculatedLinkedEntities,
    };
  }, [entities, links, startingEntity]);

  return {
    linkGroups,
    linkedEntities,
  };
};
