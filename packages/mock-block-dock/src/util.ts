import {
  BlockProtocolAggregateEntitiesFunction,
  BlockProtocolAggregateEntitiesPayload,
  BlockProtocolAggregateEntityTypesFunction,
  BlockProtocolAggregateEntityTypesPayload,
  BlockProtocolEntity,
  BlockProtocolEntityType,
  BlockProtocolMultiFilter,
  BlockProtocolMultiSort,
} from "blockprotocol";
import { get, orderBy } from "lodash";

type EntityIdentifiers = {
  accountId?: string | null;
  entityId: string;
  entityTypeId?: string | null;
};

export const matchEntityIdentifiers = (
  first: EntityIdentifiers,
  second: EntityIdentifiers,
) => {
  if (first.entityId !== second.entityId) {
    return false;
  }
  if (first.accountId != null && first.accountId !== second.accountId) {
    return false;
  }
  if (
    first.entityTypeId != null &&
    first.entityTypeId !== second.entityTypeId
  ) {
    return false;
  }
  return true;
};

type EntityTypeIdentifiers = {
  accountId?: string | null;
  entityTypeId: string | null;
};

export const matchEntityTypeIdentifiers = (
  first: EntityTypeIdentifiers,
  second: EntityTypeIdentifiers,
) => {
  if (first.entityTypeId !== second.entityTypeId) {
    return false;
  }
  if (first.accountId != null && first.accountId !== second.accountId) {
    return false;
  }
  return true;
};

type FilterEntitiesFn = {
  (params: {
    entityTypeId?: string | null;
    entityTypeVersionId?: string | null;
    entities: BlockProtocolEntity[];
    multiFilter: BlockProtocolMultiFilter;
  }): BlockProtocolEntity[];
};

const filterEntities: FilterEntitiesFn = (params) => {
  const { entityTypeId, entityTypeVersionId, entities, multiFilter } = params;

  return entities.filter((entity) => {
    if (entityTypeId && entityTypeId !== entity.entityTypeId) {
      return false;
    }

    if (
      entityTypeVersionId &&
      entityTypeVersionId !== entity.entityTypeVersionId
    ) {
      return false;
    }

    const results = multiFilter.filters
      .map((filterItem) => {
        const item = get(entity, filterItem.field);

        // @todo support non-string comparison
        if (typeof item !== "string") {
          return null;
        }

        switch (filterItem.operator) {
          case "CONTAINS":
            return item.toLowerCase().includes(filterItem.value.toLowerCase());
          case "DOES_NOT_CONTAIN":
            return !item.toLowerCase().includes(filterItem.value.toLowerCase());
          case "STARTS_WITH":
            return item
              .toLowerCase()
              .startsWith(filterItem.value.toLowerCase());
          case "ENDS_WITH":
            return item.toLowerCase().endsWith(filterItem.value.toLowerCase());
          case "IS_EMPTY":
            return !item;
          case "IS_NOT_EMPTY":
            return !!item;
          case "IS":
            return item.toLowerCase() === filterItem.value.toLowerCase();
          case "IS_NOT":
            return item.toLowerCase() !== filterItem.value.toLowerCase();
          default:
            return null;
        }
      })
      .filter((val) => val !== null);

    return multiFilter.operator === "OR"
      ? results.some(Boolean)
      : results.every(Boolean);
  });
};

const sortEntitiesOrTypes = <
  T extends BlockProtocolEntity | BlockProtocolEntityType,
>(params: {
  entities: T[];
  multiSort: BlockProtocolMultiSort;
}): T[] => {
  const { entities, multiSort } = params;

  return orderBy(
    [...entities],
    multiSort.map(
      ({ field }) =>
        (entity) =>
          get(entity, field),
    ),
    multiSort.map(({ desc }) => (desc ? "desc" : "asc")),
  );
};

const isEntityTypes = (
  entities: BlockProtocolEntity[] | BlockProtocolEntityType[],
): entities is BlockProtocolEntityType[] => "$schema" in entities[0];

type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

export function filterAndSortEntitiesOrTypes(
  entities: BlockProtocolEntity[],
  payload: BlockProtocolAggregateEntitiesPayload,
): Unpromise<ReturnType<BlockProtocolAggregateEntitiesFunction>>;
export function filterAndSortEntitiesOrTypes(
  entities: BlockProtocolEntityType[],
  payload: BlockProtocolAggregateEntityTypesPayload,
): Unpromise<ReturnType<BlockProtocolAggregateEntityTypesFunction>>;
export function filterAndSortEntitiesOrTypes(
  entities: BlockProtocolEntity[] | BlockProtocolEntityType[],
  payload:
    | BlockProtocolAggregateEntitiesPayload
    | BlockProtocolAggregateEntityTypesPayload,
):
  | Unpromise<ReturnType<BlockProtocolAggregateEntitiesFunction>>
  | Unpromise<ReturnType<BlockProtocolAggregateEntityTypesFunction>> {
  const { accountId, operation } = payload;

  const pageNumber = operation?.pageNumber || 1;
  const itemsPerPage = operation?.itemsPerPage || 10;
  const multiSort = operation?.multiSort ?? [{ field: "updatedAt" }];
  const multiFilter = operation?.multiFilter;

  const appliedOperation = {
    pageNumber,
    itemsPerPage,
    multiFilter,
    multiSort,
  };

  const startIndex = pageNumber === 1 ? 0 : (pageNumber - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, entities.length);

  // @todo add filtering to entityTypes, remove duplication below
  if (isEntityTypes(entities)) {
    let results = [...entities];
    if (accountId) {
      results = results.filter((entity) => entity.accountId);
    }
    const totalCount = results.length;
    const pageCount = Math.ceil(totalCount / itemsPerPage);
    results = sortEntitiesOrTypes({ entities: results, multiSort }).slice(
      startIndex,
      endIndex,
    );
    return {
      results,
      operation: {
        ...appliedOperation,
        totalCount,
        pageCount,
      },
    };
  }

  let results = [...entities];
  if (multiFilter) {
    results = filterEntities({
      entities: results as BlockProtocolEntity[],
      multiFilter,
    });
  }
  const entityTypeIdFilter =
    operation && "entityTypeId" in operation
      ? operation.entityTypeId
      : undefined;
  if (entityTypeIdFilter) {
    results = results.filter(
      (entity) => entity.entityTypeId === entityTypeIdFilter,
    );
  }

  const totalCount = results.length;
  const pageCount = Math.ceil(totalCount / itemsPerPage);
  results = sortEntitiesOrTypes({ entities: results, multiSort }).slice(
    startIndex,
    endIndex,
  );
  return {
    results,
    operation: {
      ...appliedOperation,
      entityTypeId: entityTypeIdFilter,
      totalCount,
      pageCount,
    },
  };
}
