/**
 * Minimal local copies of the Block Protocol type-system shapes we need.
 *
 * Previously these were imported from `@blockprotocol/type-system/slim`, but
 * that package is a workspace dependency whose `dist/` is produced by a
 * Rust + WASM build (requiring the `just` CLI). It's not built by a plain
 * `yarn install`, so importing it broke `next dev` / `next build` for anyone
 * who hadn't manually built the type-system crate.
 *
 * The BP site only ever uses these definitions for type narrowing and a few
 * `as` casts — we never construct or validate types with the WASM helpers —
 * so a local structural definition is enough. Keep these in sync with
 * https://github.com/blockprotocol/blockprotocol/blob/main/libs/%40blockprotocol/type-system/crate/src/...
 * if the on-the-wire JSON shape ever changes.
 */

/**
 * A URL pointing at a specific version of a Block Protocol type, e.g.
 * `https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1`.
 *
 * Modelled as a branded string so it can't be confused with arbitrary
 * strings at the call site.
 */
export type VersionedUrl = `${string}/v/${number}`;

/** JSON-schema-shaped Block Protocol *data* type. */
export type DataType = {
  $schema: string;
  kind: "dataType";
  $id: VersionedUrl;
  title: string;
  description?: string;
  type: string;
};

/** JSON-schema-shaped Block Protocol *property* type. */
export type PropertyType = {
  $schema: string;
  kind: "propertyType";
  $id: VersionedUrl;
  title: string;
  description?: string;
  oneOf: unknown[];
};

/** JSON-schema-shaped Block Protocol *entity* type. */
export type EntityType = {
  $schema: string;
  kind: "entityType";
  $id: VersionedUrl;
  type: "object";
  title: string;
  description?: string;
  properties: Record<string, unknown>;
  required?: string[];
  links?: Record<string, unknown>;
};
