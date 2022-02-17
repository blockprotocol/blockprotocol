import {
  BlockProtocolCreateEntitiesFunction,
  BlockProtocolCreateLinksFunction,
  BlockProtocolDeleteEntitiesFunction,
  BlockProtocolDeleteLinksFunction,
  BlockProtocolEntity,
  BlockProtocolEntityType,
  BlockProtocolFunctions,
  BlockProtocolGetEntitiesFunction,
  BlockProtocolGetLinksFunction,
  BlockProtocolLink,
  BlockProtocolUpdateEntitiesFunction,
  BlockProtocolUpdateLinksFunction,
  BlockProtocolUploadFileFunction,
} from "blockprotocol";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { matchIdentifiers } from "./util";

export type MockData = {
  entities: BlockProtocolEntity[];
  links: BlockProtocolLink[];
  entityTypes: BlockProtocolEntityType[];
  blockEntityId?: string;
};

type MockDataStore = MockData & {
  latestBlockEntity: BlockProtocolEntity | undefined;
  functions: Omit<
    // @todo implement missing functions
    BlockProtocolFunctions,
    | "aggregateEntities"
    | "aggregateEntityTypes"
    | "getEntityTypes"
    | "createEntityTypes"
    | "updateEntityTypes"
    | "deleteEntityTypes"
    | "uploadFile"
  >;
};

type UseMockDataStore = (initialData?: MockData) => MockDataStore;

export const useMockDatastore: UseMockDataStore = (
  initialData = {
    entities: [],
    links: [],
    entityTypes: [],
    blockEntityId: "",
  },
) => {
  const [entities, setEntities] = useState<MockDataStore["entities"]>(
    initialData.entities,
  );
  const [latestBlockEntity, setLatestBlockEntity] = useState(
    entities.find((entity) => entity.entityId === initialData.blockEntityId),
  );
  const [links, setLinks] = useState<MockDataStore["links"]>(initialData.links);
  const [entityTypes, _setEntityTypes] = useState<MockDataStore["entityTypes"]>(
    initialData.entityTypes,
  );

  useEffect(() => {
    setEntities(initialData.entities);
  }, [initialData.entities]);

  useEffect(() => {
    let nextLatestBlockEntity = entities.find(
      (entity) => entity.entityId === initialData.blockEntityId,
    );

    if (!nextLatestBlockEntity) {
      nextLatestBlockEntity = initialData.entities.find(
        (entity) => entity.entityId === initialData.blockEntityId,
      );
    }

    setLatestBlockEntity(nextLatestBlockEntity);
  }, [initialData.blockEntityId, initialData.entities, entities]);

  const createEntities: BlockProtocolCreateEntitiesFunction = useCallback(
    async (actions) => {
      const { newEntities, newLinks } = actions.reduce<{
        newEntities: BlockProtocolEntity[];
        newLinks: BlockProtocolLink[];
      }>(
        (map, action) => {
          const entityId = uuid();
          const { accountId, entityTypeId, entityTypeVersionId } = action;
          const newEntity = {
            accountId,
            entityId,
            entityTypeId,
            entityTypeVersionId,
            ...action.data,
          };
          map.newEntities.push(newEntity);
          const linksToCreate = (action.links ?? []).map((link) => ({
            linkId: uuid(),
            sourceEntityAccountId: accountId,
            sourceEntityId: entityId,
            sourceEntityTypeId: entityTypeId,
            ...link,
          }));
          map.newLinks.push(...linksToCreate);
          return map;
        },
        {
          newEntities: [],
          newLinks: [],
        },
      );
      setEntities((currentEntities) => [...currentEntities, ...newEntities]);
      setLinks((currentLinks) => [...currentLinks, ...newLinks]);
      return newEntities;
    },
    [],
  );

  const getEntities: BlockProtocolGetEntitiesFunction = useCallback(
    async (actions) =>
      actions.map((action) =>
        entities.find((entity) => matchIdentifiers(entity, action)),
      ),
    [entities],
  );

  const updateEntities: BlockProtocolUpdateEntitiesFunction = useCallback(
    async (actions) => {
      const updatedEntities: BlockProtocolEntity[] = [];
      setEntities((currentEntities) =>
        currentEntities.map((entity) => {
          const actionToApply = actions.find((action) =>
            matchIdentifiers(action, entity),
          );
          if (actionToApply) {
            const newEntity = {
              ...actionToApply.data,
              accountId: entity.accountId,
              entityId: entity.entityId,
              entityTypeId: entity.entityTypeId,
              entityTypeVersionId: entity.entityTypeVersionId,
            };
            updatedEntities.push(newEntity);
            return newEntity;
          }
          return entity;
        }),
      );
      return updatedEntities;
    },
    [],
  );

  const deleteEntities: BlockProtocolDeleteEntitiesFunction = useCallback(
    async (actions) => {
      setEntities((currentEntities) =>
        currentEntities
          .map((entity) => {
            const isMatch = actions.some((action) =>
              matchIdentifiers(entity, action),
            );
            if (isMatch) {
              return null;
            }
            return entity;
          })
          .filter((entity): entity is BlockProtocolEntity => !!entity),
      );
      return new Array(actions.length).fill(true);
    },
    [],
  );

  const createLinks: BlockProtocolCreateLinksFunction = useCallback(
    async (actions) => {
      const newLinks = actions.map((action) => ({
        linkId: uuid(),
        ...action,
      }));
      setLinks((currentLinks) => [...currentLinks, ...newLinks]);
      return newLinks;
    },
    [],
  );

  const getLinks: BlockProtocolGetLinksFunction = useCallback(
    async (actions) =>
      actions.map(
        ({ linkId }) => links.find((link) => link.linkId === linkId)!,
      ),
    [links],
  );

  const updateLinks: BlockProtocolUpdateLinksFunction = useCallback(
    async (actions) => {
      const updatedLinks: BlockProtocolLink[] = [];
      setLinks((currentLinks) =>
        currentLinks.map((link) => {
          const actionToApply = actions.find(
            (action) => link.linkId === action.linkId,
          );
          if (actionToApply) {
            const newLink = { ...link, ...actionToApply } as BlockProtocolLink;
            updatedLinks.push(newLink);
            return newLink;
          }
          return link;
        }),
      );
      return updatedLinks as BlockProtocolLink[];
    },
    [],
  );

  const deleteLinks: BlockProtocolDeleteLinksFunction = useCallback(
    async (actions) => {
      setLinks((currentLinks) =>
        currentLinks
          .map((link) => {
            const isMatch = actions.some(
              (action) => action.linkId === link.linkId,
            );
            if (isMatch) {
              return null;
            }
            return link;
          })
          .filter((link): link is BlockProtocolLink => !!link),
      );
      return new Array(actions.length).fill(true);
    },
    [],
  );

  const uploadFile: BlockProtocolUploadFileFunction = useCallback(
    async ({ accountId, file, url, mediaType }) => {
      if (!file && !url?.trim()) {
        throw new Error(
          `Please enter a valid ${mediaType} URL or select a file below`,
        );
      }

      if (url?.trim()) {
        return createEntities([
          {
            accountId,
            data: {
              url,
              mediaType,
            },
            entityTypeId: "file1",
          },
        ]).then(
          (resp) => resp[0] as ReturnType<BlockProtocolUploadFileFunction>,
        );
      } else if (file) {
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target?.result) {
            return createEntities([
              {
                accountId,
                data: {
                  url: event.target.result.toString(),
                  mediaType,
                },
                entityTypeId: "file1",
              },
            ]).then(
              (resp) => resp[0] as ReturnType<BlockProtocolUploadFileFunction>,
            );
          } else {
            throw new Error("Couldn't read your file");
          }
        };

        reader.readAsDataURL(file);
      }

      throw new Error("Unreachable.");
    },
    [createEntities],
  );

  return {
    entities,
    entityTypes,
    functions: {
      getEntities,
      createEntities,
      deleteEntities,
      updateEntities,
      getLinks,
      createLinks,
      deleteLinks,
      updateLinks,
      uploadFile,
    },
    latestBlockEntity,
    links,
  };
};
