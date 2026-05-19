/* istanbul ignore file */
/**
 * @see https://github.com/vercel/next.js/issues/32608#issuecomment-1007439478
 * `istanbul ignore file` above is required because this module is imported by
 * `src/middleware.page.ts`, which runs in the Edge runtime. Istanbul-instrumented
 * code uses dynamic evaluation patterns that the Edge runtime forbids, so any
 * module that the middleware (transitively) pulls in must opt out of coverage.
 */
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
 * Versions that are still working drafts rather than published releases.
 *
 * A "draft" version is one whose pages still ship the working-draft
 * `<GitHubInfoCard />` callout (see `github-info-card.tsx`) — i.e. its
 * content is being iterated on in public and shouldn't be presented to
 * readers as the canonical, released version of the spec/docs. The
 * version picker uses this to label the entry as "Draft (X.Y)" instead
 * of "Latest (X.Y)" so users coming from older content don't mistake
 * the in-flight version for the current published one.
 *
 * Treat this as the source of truth: when a draft is finalised, remove
 * it from this list and the picker label flips back to "Latest" without
 * any other code changes.
 */
const DRAFT_DOCS_VERSIONS: readonly DocsVersion[] = ["0.4"];

export const isDraftVersion = (version: DocsVersion): boolean =>
  DRAFT_DOCS_VERSIONS.includes(version);

/**
 * Human-readable label for the version picker.
 *
 * - Drafts are surfaced as `Draft (X.Y)`, regardless of whether they're
 *   also the latest version, because being the newest entry in
 *   {@link DOCS_VERSIONS} doesn't imply the spec is finalised.
 * - The latest non-draft version is surfaced as `Latest (X.Y)`.
 * - Older non-draft versions are surfaced as `Version X.Y`.
 */
export const formatVersionLabel = (version: DocsVersion): string => {
  if (isDraftVersion(version)) {
    return `Draft (${version})`;
  }
  if (version === LATEST_DOCS_VERSION) {
    return `Latest (${version})`;
  }
  return `Version ${version}`;
};

/**
 * Returns versions newer than `version`, ordered newest-first. Walks the
 * declared `DOCS_VERSIONS` list (which is itself newest-first), so the head
 * of the result is the latest version available.
 */
export const versionsNewerThan = (version: DocsVersion): DocsVersion[] => {
  const index = DOCS_VERSIONS.indexOf(version);
  if (index <= 0) {
    return [];
  }
  return DOCS_VERSIONS.slice(0, index);
};

/**
 * Versions in which the Graph Module is still a first-class part of the spec.
 *
 * From 0.4 onwards the Graph Module has been split out into the standalone
 * SemType specification (https://semtype.org/spec). The page at
 * `/spec/<v>/graph` still resolves at deprecated versions (showing a notice),
 * but it's hidden from the sidebar and any deep links into former sub-pages
 * (`/spec/<v>/graph/<anything>`) are redirected to the notice page itself.
 */
const GRAPH_MODULE_SUPPORTED_VERSIONS: readonly DocsVersion[] = ["0.3"];

export const isGraphModuleSupported = (version: DocsVersion): boolean =>
  GRAPH_MODULE_SUPPORTED_VERSIONS.includes(version);
