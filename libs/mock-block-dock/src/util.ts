import { JsonObject, JsonValue } from "@blockprotocol/core";
import {
  Entity,
  EntityRootType,
  EntityTypeRootType,
  EntityTypeWithMetadata,
  MultiFilter,
  MultiSort,
  QueryEntitiesData,
  QueryEntitiesResult,
  QueryEntityTypesData,
  QueryEntityTypesResult,
  Subgraph,
} from "@blockprotocol/graph";
import {
  Entity as EntityTemporal,
  EntityRootType as EntityRootTypeTemporal,
  EntityTypeRootType as EntityTypeRootTypeTemporal,
  QueryEntitiesData as QueryEntitiesDataTemporal,
  QueryEntitiesResult as QueryEntitiesResultTemporal,
  QueryEntityTypesResult as QueryEntityTypesResultTemporal,
  QueryTemporalAxes,
  Subgraph as SubgraphTemporal,
} from "@blockprotocol/graph/temporal";

export const mustBeDefined = <T>(x: T | undefined, message?: string): T => {
  if (x === undefined) {
    throw new Error(`invariant was broken: ${message ?? ""}`);
  }

  return x;
};

// @todo deduplicate this and libs/@blockprotocol/graph/src/internal/mutate-subgraph/is-equal.ts
// https://gist.github.com/jsjain/a2ba5d40f20e19f734a53c0aad937fbb
export const isEqual = (first: any, second: any): boolean => {
  if (first === second) {
    return true;
  }
  if (
    (first === undefined ||
      second === undefined ||
      first === null ||
      second === null) &&
    (first || second)
  ) {
    return false;
  }
  const firstType = first?.constructor.name;
  const secondType = second?.constructor.name;
  if (firstType !== secondType) {
    return false;
  }
  if (firstType === "Array") {
    if (first.length !== second.length) {
      return false;
    }
    let equal = true;
    for (let i = 0; i < first.length; i++) {
      if (!isEqual(first[i], second[i])) {
        equal = false;
        break;
      }
    }
    return equal;
  }
  if (firstType === "Object") {
    let equal = true;
    const fKeys = Object.keys(first);
    const sKeys = Object.keys(second);
    if (fKeys.length !== sKeys.length) {
      return false;
    }
    for (let i = 0; i < fKeys.length; i++) {
      const firstField = first[fKeys[i]!];
      const secondField = second[fKeys[i]!];
      if (firstField && secondField) {
        if (firstField === secondField) {
          continue;
        }
        if (
          firstField &&
          (firstField.constructor.name === "Array" ||
            firstField.constructor.name === "Object")
        ) {
          equal = isEqual(firstField, secondField);
          if (!equal) {
            break;
          }
        } else if (firstField !== secondField) {
          equal = false;
          break;
        }
      } else if ((firstField && !secondField) || (!firstField && secondField)) {
        equal = false;
        break;
      }
    }
    return equal;
  }
  return first === second;
};

// @todo deduplicate this and libs/@blockprotocol/graph/src/shared.ts
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

const contains = (item: JsonValue, value: JsonValue): boolean | null => {
  if (typeof item === "string" && typeof value === "string") {
    return item.includes(value);
  } else if (Array.isArray(item) && Array.isArray(value)) {
    return value.every((val) => item.includes(val));
  } else if (
    typeof item === "object" &&
    !Array.isArray(item) &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    if (item === null || value === null) {
      return null;
    }
    return typedKeys(value).every((key) => isEqual(item[key], value[key]));
  }
  return null;
};

const filterEntitiesOrEntityTypes = <
  Elements extends (Entity[] | EntityTemporal[]) | EntityTypeWithMetadata[],
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
      .map((filterItem): boolean | null => {
        /* @todo - should we catch potential errors here? */
        const item = getFromObjectByPathComponents(entity, filterItem.field);

        switch (filterItem.operator) {
          case "IS_DEFINED": {
            return item === undefined;
          }
          case "IS_NOT_DEFINED":
            return item !== undefined;
          case "CONTAINS_SEGMENT":
            if (item === undefined) {
              return null;
            }
            return contains(item, filterItem.value);
          case "DOES_NOT_CONTAIN_SEGMENT": {
            if (item === undefined) {
              return null;
            }
            const doesContain = contains(item, filterItem.value);
            return doesContain === null ? null : !doesContain;
          }
          case "EQUALS":
            return isEqual(item, filterItem.value);
          case "DOES_NOT_EQUAL":
            return !isEqual(item, filterItem.value);
          case "STARTS_WITH":
            if (
              typeof item === "string" &&
              typeof filterItem.value === "string"
            ) {
              return item.startsWith(filterItem.value);
            } else if (Array.isArray(item) && Array.isArray(filterItem.value)) {
              return isEqual(
                item.slice(0, filterItem.value.length),
                filterItem.value,
              );
            }
            return null;
          case "ENDS_WITH":
            if (
              typeof item === "string" &&
              typeof filterItem.value === "string"
            ) {
              return item.endsWith(filterItem.value);
            } else if (Array.isArray(item) && Array.isArray(filterItem.value)) {
              return isEqual(
                item.slice(-filterItem.value.length),
                filterItem.value,
              );
            }
            return null;
        }

        /* @ts-expect-error - This should be unreachable, it's here for JS or incorrectly typed usages */
        throw new Error(`Unknown filter operator: ${filterItem.operator}`);
      })
      .filter((val) => val !== null);

    return params.multiFilter.operator === "OR"
      ? results.some(Boolean)
      : results.every(Boolean);
  });
};

const sortEntitiesOrTypes = <
  Elements extends (Entity[] | EntityTemporal[]) | EntityTypeWithMetadata[],
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
  T extends
    | (Entity | EntityTypeWithMetadata)
    | (EntityTemporal | EntityTypeWithMetadata) =
    | Entity
    | EntityTypeWithMetadata,
> = {
  results: T[];
  operation:
    | QueryEntitiesResult<Subgraph<EntityRootType>>["operation"]
    | QueryEntityTypesResult<Subgraph<EntityTypeRootType>>["operation"]
    | QueryEntitiesResultTemporal<
        SubgraphTemporal<EntityRootTypeTemporal>
      >["operation"]
    | QueryEntityTypesResultTemporal<
        SubgraphTemporal<EntityTypeRootTypeTemporal>
      >["operation"];
};

export function filterAndSortEntitiesOrTypes(
  elements: Entity[],
  payload: QueryEntitiesData,
): FilterResult<Entity>;
export function filterAndSortEntitiesOrTypes(
  elements: EntityTemporal[],
  payload: Omit<QueryEntitiesDataTemporal, "temporalAxes"> & {
    temporalAxes: QueryTemporalAxes;
  },
): FilterResult<EntityTemporal>;
export function filterAndSortEntitiesOrTypes(
  elements: EntityTypeWithMetadata[],
  payload: QueryEntityTypesData,
): FilterResult<EntityTypeWithMetadata>;
export function filterAndSortEntitiesOrTypes<
  Elements extends
    | (Entity[] | EntityTypeWithMetadata[])
    | (EntityTemporal[] | EntityTypeWithMetadata[]),
>(
  elements: Elements,
  payload:
    | QueryEntitiesData
    | (Omit<QueryEntitiesDataTemporal, "temporalAxes"> & {
        temporalAxes: QueryTemporalAxes;
      })
    | QueryEntityTypesData,
): FilterResult {
  const { operation } = payload;

  // Fallback by sorting by recordId, as this is a combined function we need to deal with both `OntologyTypeRecordId`
  // and `EntityRecordId` which have different fields. We handle `undefined` values within the sort function so this
  // is safe.
  const multiSort = operation?.multiSort ?? [
    { field: ["metadata", "recordId", "entityId"] },
    { field: ["metadata", "recordId", "editionId"] },
    { field: ["metadata", "recordId", "baseUrl"] },
    { field: ["metadata", "recordId", "version"] },
  ];
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
