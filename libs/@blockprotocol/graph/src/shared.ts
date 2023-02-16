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

type Entry<T extends {}> = T extends readonly [unknown, ...unknown[]]
  ? TupleEntry<T>
  : T extends ReadonlyArray<infer U>
  ? [`${number}`, U]
  : ObjectEntry<T>;

// @todo deduplicate this and libs/mock-block-dock/src/util.ts
/** `Object.entries` analogue which returns a well-typed array
 *
 * Source: https://dev.to/harry0000/a-bit-convenient-typescript-type-definitions-for-objectentries-d6g
 */
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
 * Checks if a given string is exactly a non-negative integer.
 *
 * For example, it will accept strings such as:
 * - "0"
 * - "1"
 * - "94818981"
 *
 * And it will not accept strings such as:
 * - "0.0"
 * - "1.0"
 * - "-1"
 * - "foo"
 * - "0foo"
 * - "1.1"
 *
 * @param {string} input
 */
export const stringIsNonNegativeInteger = (
  input: string,
): input is `${number}` => {
  const asInteger = Number.parseInt(input, 10);
  return asInteger.toString() === input && asInteger >= 0;
};
