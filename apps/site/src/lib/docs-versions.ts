/**
 * Declared newest first. The first entry is treated as the latest version
 * and is what `/docs` and `/spec` (without an explicit version) redirect to.
 *
 * To publish a new version: add it to the front of this list and create the
 * corresponding folders under `src/_pages/docs/<version>/` and
 * `src/_pages/spec/<version>/`. Pages that don't exist in the new version
 * automatically fall back to the previous version (see
 * `resolveVersionedSourcePath` in `src/util/mdx-utils.tsx`).
 */
export const DOCS_VERSIONS = ["0.4", "0.3"] as const;

export type DocsVersion = (typeof DOCS_VERSIONS)[number];

export const LATEST_DOCS_VERSION: DocsVersion = DOCS_VERSIONS[0];

export const isDocsVersion = (value: string): value is DocsVersion =>
  (DOCS_VERSIONS as readonly string[]).includes(value);

/**
 * Sections that are versioned via the folder-per-version scheme.
 * Used by the middleware redirect and the version picker to decide which
 * routes participate in the versioning system.
 */
export const VERSIONED_SECTIONS = ["docs", "spec"] as const;

export type VersionedSection = (typeof VERSIONED_SECTIONS)[number];

export const isVersionedSection = (value: string): value is VersionedSection =>
  (VERSIONED_SECTIONS as readonly string[]).includes(value);

/**
 * Returns the list of versions that should be tried, in order, when resolving
 * a page for the requested version. Starts at `requestedVersion` and walks
 * back to older versions in declaration order.
 */
export const fallbackVersionChain = (
  requestedVersion: DocsVersion,
): DocsVersion[] => {
  const startIndex = DOCS_VERSIONS.indexOf(requestedVersion);
  if (startIndex === -1) {
    return [];
  }
  return DOCS_VERSIONS.slice(startIndex);
};

/**
 * Human-readable label for the version picker. The latest version is
 * surfaced as "Latest (X.Y)"; others as "Version X.Y".
 */
export const formatVersionLabel = (version: DocsVersion): string =>
  version === LATEST_DOCS_VERSION
    ? `Latest (${version})`
    : `Version ${version}`;
