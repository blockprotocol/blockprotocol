import { JsonObject, JsonValue } from "@blockprotocol/core";
import {
  AggregateEntitiesData,
  AggregateEntitiesResult,
  AggregateEntityTypesData,
  AggregateEntityTypesResult,
  Entity,
  EntityRootType,
  EntityTypeRootType,
  EntityTypeWithMetadata,
  MultiFilter,
  MultiSort,
  QueryTemporalAxes,
  Subgraph,
} from "@blockprotocol/graph";

export const mustBeDefined = <T>(x: T | undefined, message?: string): T => {
  if (x === undefined) {
    throw new Error(`invariant was broken: ${message ?? ""}`);
  }

  return x;
};

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
export const typedEntries = <T extends {}>(
  object: T,
): ReadonlyArray<Entry<T>> => {
  return Object.entries(object) as unknown as ReadonlyArray<Entry<T>>;
};

/** `Object.values` analogue which returns a well-typed array */
export const typedKeys = <T extends {}>(object: T): Entry<T>[0][] => {
  return Object.keys(object) as Entry<T>[0][];
};

/** `Object.values` analogue which returns a well-typed array */
export const typedValues = <T extends {}>(object: T): Entry<T>[1][] => {
  return Object.values(object);
};

/**
 * Extracts the value that lies at a given path in a given object, where the path is expressed as an array of JSON path
 * components.
 *
 * @example
 * const obj = {
 *   a: {
 *     b: true,
 *     c: "foo",
 *     d: [null, 23],
 *     e: undefined
 *   }
 * }
 *
 * getFromObjectByPathComponents(obj, ["a"]); // { b: true, c: "foo", d: [null, 23]}
 * getFromObjectByPathComponents(obj, ["a", "b"]); // true
 * getFromObjectByPathComponents(obj, ["a", "c"]); // "foo"
 * getFromObjectByPathComponents(obj, ["a", "d"]); // [null, 23]
 * getFromObjectByPathComponents(obj, ["a", "d", 0]); // null
 * getFromObjectByPathComponents(obj, ["a", "d", 1]); // 23
 * getFromObjectByPathComponents(obj, ["a", "e"]); // undefined
 * getFromObjectByPathComponents(obj, ["b"]); // undefined
 *
 * @param object - the object to search inside
 * @param {(string|number)[]} path - the path as a list of path components where object keys are given as `string`s,
 *   and array indices are given as `number`s
 *
 * @returns {JsonValue | undefined} - the value within the object at that path, or `undefined` if it does not exist
 *
 * @throws - if the path points to an invalid portion of the object, e.g. if it tries to index a null value `getFromObjectByPathComponents({ a: null }, ["a", "b"]);`
 */
export const getFromObjectByPathComponents = (
  object: object,
  path: (string | number)[],
): JsonValue | undefined => {
  let subObject = object as JsonValue;

  for (const pathComponent of path) {
    if (subObject === null) {
      throw new Error(
        `Invalid path: ${path} on object ${JSON.stringify(
          object,
        )}, can't index null value`,
      );
    }
    // @ts-expect-error -- expected ‘No index signature with a parameter of type 'string' was found on type '{}'’
    const innerVal = subObject[pathComponent];
    if (innerVal === undefined) {
      return undefined;
    }
    subObject = innerVal;
  }

  return subObject;
};

/**
 * Sets a value that lies at a given path in a given object, where the path is expressed as an array of JSON path
 * components.
 *
 * @example
 * const obj = {
 *   a: {
 *     b: true,
 *     c: [null, 23],
 *     d: undefined
 *   }
 * }
 *
 * setValueInObjectByPathComponents(obj, ["a", "c", 0], 12); //  obj = { a: { b: true, c: [12, 23], d: undefined } }
 * setValueInObjectByPathComponents(obj, ["a", "c", 1], null); //  obj = { a: { b: true, c: [12, null], d: undefined } }
 * setValueInObjectByPathComponents(obj, ["a", "d"], { e: "bar" }); //  obj = { a: { b: true, c: [null, 23], d: { e: "bar" } } }
 * setValueInObjectByPathComponents(obj, ["a", "b"], false); //  obj = { a: { b: false, c: [null, 23], d: { e: "bar" } } }
 * setValueInObjectByPathComponents(obj, ["a"], 3); // obj = { a: 3 }
 * setValueInObjectByPathComponents(obj, ["b"], true); // obj = { a: 3, b: true }
 *
 * @param object - the object to search inside
 * @param {(string|number)[]} path - the path as a list of path components where object keys are given as `string`s,
 * @param {JsonValue} value - the value to set within the object
 *
 * @returns {JsonValue | undefined} - the value within the object at that path, or `undefined` if it does not exist
 *
 * @throws - if the path points to an invalid portion of the object, e.g. if it tries to index a null or undefined
 *    value `setValueInObjectByPathComponents({ a: null }, ["a", "b"], true);`
 * @throws - if the path indexes a non-array or non-object
 * @throws - if the path indexes an object with a non-string key
 * @throws - if the path indexes an array with a non-number key
 */
export const setValueInObjectByPathComponents = (
  object: object,
  path: (string | number)[],
  value: JsonValue,
) => {
  if (path.length === 0) {
    throw new Error(`An empty path is invalid, can't set value.`);
  }

  let subObject = object as JsonValue;

  for (let index = 0; index < path.length - 1; index++) {
    const pathComponent = path[index];

    if (pathComponent === "constructor" || pathComponent === "__proto__") {
      throw new Error(`Disallowed key ${pathComponent}`);
    }

    // @ts-expect-error -- expected ‘No index signature with a parameter of type 'string' was found on type '{}'’
    const innerVal = subObject[pathComponent];
    if (innerVal === undefined) {
      throw new Error(
        `Unable to set value on object, ${path
          .slice(0, index)
          .map((component) => `[${component}]`)
          .join(".")} was missing in object`,
      );
    }

    // We check this here because the loop goes up to but _not including_ the last path component. So a `null` value
    // would be an error
    if (innerVal === null) {
      throw new Error(
        `Invalid path: ${path} on object ${JSON.stringify(
          object,
        )}, can't index null value`,
      );
    }

    subObject = innerVal;
  }

  const lastComponent = path.at(-1)!;
  if (Array.isArray(subObject)) {
    if (typeof lastComponent === "number") {
      subObject[lastComponent] = value;
    } else {
      throw new Error(
        `Unable to set value on array using non-number index: ${lastComponent}`,
      );
    }
  } else if (typeof subObject === "object") {
    if (typeof lastComponent === "string") {
      (subObject as JsonObject)[lastComponent] = value;
    } else {
      throw new Error(
        `Unable to set key on object using non-string index: ${lastComponent}`,
      );
    }
  } else {
    throw new Error(
      `Unable to set value on non-object and non-array type: ${typeof subObject}`,
    );
  }
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

const filterEntitiesOrEntityTypes = <
  Temporal extends boolean,
  Elements extends Entity<Temporal>[] | EntityTypeWithMetadata[],
>(params: {
  elements: Elements;
  multiFilter: MultiFilter;
}) => {
  // We recast these to ensure there are callable implementations of the functional iterators
  const elements: Array<Elements[number]> = params.elements;
  const filterItems: Array<MultiFilter["filters"][number]> =
    params.multiFilter.filters;

  return elements.filter((entity) => {
    const results = filterItems
      .map((filterItem) => {
        const item = getFromObjectByPathComponents(entity, filterItem.field);

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

    return params.multiFilter.operator === "OR"
      ? results.some(Boolean)
      : results.every(Boolean);
  });
};

const sortEntitiesOrTypes = <
  Temporal extends boolean,
  Elements extends Entity<Temporal>[] | EntityTypeWithMetadata[],
>(params: {
  elements: Elements;
  multiSort: MultiSort;
}): Elements => {
  const { elements, multiSort } = params;

  return [...elements].sort((a, b) => {
    for (const sortItem of multiSort) {
      const aValue = getFromObjectByPathComponents(a, sortItem.field);
      const bValue = getFromObjectByPathComponents(b, sortItem.field);

      // @ts-expect-error -- tolerating null and undefined
      if (aValue < bValue) {
        return sortItem.desc ? 1 : -1;
        // @ts-expect-error -- tolerating null and undefined
      } else if (aValue > bValue) {
        return sortItem.desc ? -1 : 1;
      }
    }

    return 0;
  }) as Elements;
};

export type FilterResult<
  Temporal extends boolean,
  T extends Entity<Temporal> | EntityTypeWithMetadata =
    | Entity<Temporal>
    | EntityTypeWithMetadata,
> = {
  results: T[];
  operation:
    | AggregateEntitiesResult<
        Temporal,
        Subgraph<Temporal, EntityRootType<Temporal>>
      >["operation"]
    | AggregateEntityTypesResult<
        Subgraph<Temporal, EntityTypeRootType>
      >["operation"];
};

export function filterAndSortEntitiesOrTypes<Temporal extends boolean>(
  elements: Entity<Temporal>[],
  payload: Omit<AggregateEntitiesData<Temporal>, "temporalAxes"> & {
    temporalAxes: QueryTemporalAxes;
  },
): FilterResult<Temporal, Entity<Temporal>>;
export function filterAndSortEntitiesOrTypes<Temporal extends boolean>(
  elements: EntityTypeWithMetadata[],
  payload: AggregateEntityTypesData,
): FilterResult<Temporal, EntityTypeWithMetadata>;
export function filterAndSortEntitiesOrTypes<
  Temporal extends boolean,
  Elements extends Entity<Temporal>[] | EntityTypeWithMetadata[],
>(
  elements: Elements,
  payload:
    | (Omit<AggregateEntitiesData<Temporal>, "temporalAxes"> & {
        temporalAxes: QueryTemporalAxes;
      })
    | AggregateEntityTypesData,
): FilterResult<Temporal> {
  const { operation } = payload;

  const multiSort = operation?.multiSort ?? [{ field: "updatedAt" }];
  const multiFilter = operation?.multiFilter;

  const appliedOperation = {
    multiFilter,
    multiSort,
  };

  let results = [...elements] as Elements;
  if (multiFilter) {
    results = filterEntitiesOrEntityTypes({
      elements: results,
      multiFilter,
    }) as Elements;
  }

  results = sortEntitiesOrTypes({
    elements: results,
    multiSort,
  });
  return {
    results,
    operation: appliedOperation,
  };
}
