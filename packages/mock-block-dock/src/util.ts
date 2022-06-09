import {
  AggregateEntitiesData,
  AggregateEntitiesResult,
  AggregateEntityTypesData,
  Entity,
  EntityType,
  MultiFilter,
  MultiSort,
} from "@blockprotocol/graph";
import { get, orderBy } from "lodash";

type FilterEntitiesFn = {
  (params: {
    entityTypeId?: string | null;
    entities: Entity[];
    multiFilter: MultiFilter;
  }): Entity[];
};

const filterEntities: FilterEntitiesFn = (params) => {
  const { entityTypeId, entities, multiFilter } = params;

  return entities.filter((entity) => {
    if (entityTypeId && entityTypeId !== entity.entityTypeId) {
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

const sortEntitiesOrTypes = <T extends Entity | EntityType>(params: {
  entities: T[];
  multiSort: MultiSort;
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
  entities: Entity[] | EntityType[],
): entities is EntityType[] => "schema" in entities[0];

export function filterAndSortEntitiesOrTypes(
  entities: Entity[],
  payload: AggregateEntitiesData,
): AggregateEntitiesResult<Entity>;
export function filterAndSortEntitiesOrTypes(
  entities: EntityType[],
  payload: AggregateEntityTypesData,
): AggregateEntitiesResult<EntityType>;
export function filterAndSortEntitiesOrTypes(
  entities: Entity[] | EntityType[],
  payload: AggregateEntitiesResult<EntityType> | AggregateEntityTypesData,
): AggregateEntitiesResult<Entity> | AggregateEntitiesResult<EntityType> {
  const { operation } = payload;

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
      entities: results,
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
