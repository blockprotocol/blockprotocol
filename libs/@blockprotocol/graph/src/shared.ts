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
type Entry<T extends {}> = T extends readonly [unknown, ...unknown[]]
  ? TupleEntry<T>
  : T extends ReadonlyArray<infer U>
  ? [`${number}`, U]
  : ObjectEntry<T>;

// @todo deduplicate this and packages/mock-block-dock/src/util.ts
/** `Object.entries` analogue which returns a well-typed array */
export function typedEntries<T extends {}>(object: T): ReadonlyArray<Entry<T>> {
  return Object.entries(object) as unknown as ReadonlyArray<Entry<T>>;
}
