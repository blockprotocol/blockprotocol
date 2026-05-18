/**
 * Account creation, login, and Mongo-backed user lookups have been removed
 * while the Block Protocol team focuses on HASH. The site is rendered
 * statically from `hub-snapshot.json` and there is no authenticated user.
 *
 * This file still exports the `SerializedUser` type because static profile
 * pages (`/@:shortname`) and a handful of UI components describe their data
 * using it. All callers should treat the user as a read-only static record.
 */

export type SerializedUser = {
  id: string;
  isSignedUp: boolean;
  shortname?: string;
  preferredName?: string;
  userAvatarUrl?: string;
};
