import {
  AggregateEntitiesData,
  AggregateEntitiesResult,
  AggregateEntityTypesData,
  Entity,
  EntityType,
  MultiFilter,
  MultiSort,
} from "@blockprotocol/graph";

type TupleEntry<
  T extends readonly unknown[],
  I extends unknown[] = [],
  R = never,
> = T extends readonly [infer Head, ...infer Tail]
  ? TupleEntry<Tail, [...I, unknown], R | [`${I["length"]}`, Head]>
  : R;

type ObjectEntry<T extends {}> = T extends object
  ? { [K in keyof T]: [K, Required<T>[K]] }[keyof T] extends infer E
    ? E extends [infer K, infer V]
      ? K extends string | number
        ? [`${K}`, V]
        : never
      : never
    : never
  : never;

// Source: https://dev.to/harry0000/a-bit-convenient-typescript-type-definitions-for-objectentries-d6g
export type Entry<T extends {}> = T extends readonly [unknown, ...unknown[]]
  ? TupleEntry<T>
  : T extends ReadonlyArray<infer U>
  ? [`${number}`, U]
  : ObjectEntry<T>;

/** `Object.entries` analogue which returns a well-typed array */
export function typedEntries<T extends {}>(object: T): ReadonlyArray<Entry<T>> {
  return Object.entries(object) as unknown as ReadonlyArray<Entry<T>>;
}

type FilterEntitiesFn = {
  (params: {
    entityTypeId?: string | null;
    entities: Entity[];
    multiFilter: MultiFilter;
  }): Entity[];
};

// Saves us from using heavy lodash dependency
// Source: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_get
export const get = (
  obj: unknown,
  path: string | string[],
  defaultValue = undefined,
): unknown => {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) =>
          res !== null && res !== undefined
            ? // @ts-expect-error -- expected ‘No index signature with a parameter of type 'string' was found on type '{}'’
              res[key]
            : res,
        obj,
      );
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};

export const set = (obj: {}, path: string | string[], value: unknown) => {
  const keys = typeof path === "string" ? path.split(".") : path;

  let currentObj = obj;

  let i;

  for (i = 0; i < keys.length - 1; i++) {
    if (i === 0 && keys[i] === "$") {
      // ignore leading json path identifier, if present
      continue;
    }
    // @ts-expect-error -- expected ‘No index signature with a parameter of type 'string' was found on type '{}'’
    currentObj = currentObj[keys[i]!];
  }

  if (keys[i] === "constructor" || keys[i] === "__proto__") {
    throw new Error(`Disallowed key ${keys[i]}`);
  }
  // @ts-expect-error -- expected ‘No index signature with a parameter of type 'string' was found on type '{}'’
  currentObj[keys[i]!] = value;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delayMs: number,
) => {
  let timerId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => func(...args), delayMs);
  };
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

  return [...entities].sort((a, b) => {
    for (const sortItem of multiSort) {
      const aValue = get(a, sortItem.field);
      const bValue = get(b, sortItem.field);

      // @ts-expect-error -- tolerating null and undefined
      if (aValue < bValue) {
        return sortItem.desc ? 1 : -1;
        // @ts-expect-error -- tolerating null and undefined
      } else if (aValue > bValue) {
        return sortItem.desc ? -1 : 1;
      }
    }

    return 0;
  });
};

const isEntityTypes = (
  entities: Entity[] | EntityType[],
): entities is EntityType[] => "schema" in (entities[0] ?? {});

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
