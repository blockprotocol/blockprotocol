import { JsonObject, JsonValue } from "@blockprotocol/graph";

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

export interface MemoizableFetchFunction<T> {
  (url: string, signal?: AbortSignal): Promise<T>;
}

/**
 * Memoize a fetch function by its URL.
 */
export function memoizeFetchFunction<T>(
  fetchFunction: MemoizableFetchFunction<T>,
): MemoizableFetchFunction<T> {
  const cache: Record<string, Promise<any>> = {};

  return async (url, signal) => {
    if (cache[url] == null) {
      let fulfilled = false;
      const promise = fetchFunction(url, signal);

      promise
        .then(() => {
          fulfilled = true;
        })
        .catch(() => {
          if (cache[url] === promise) {
            delete cache[url];
          }
        });

      signal?.addEventListener("abort", () => {
        if (cache[url] === promise && !fulfilled) {
          delete cache[url];
        }
      });

      cache[url] = promise;
    }

    return await cache[url];
  };
}

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
