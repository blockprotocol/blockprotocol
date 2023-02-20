export class InconsistentTemporalVersioningSupportError extends Error {
  components: Record<string, boolean>;
  kind = "InconsistentTemporalVersioningSupportError";

  constructor(components: Record<string, boolean>) {
    const message =
      `Invalid arguments, expected all fields to consistently support temporal versioning or not. Mixed ` +
      `temporal/non-temporal arguments are not supported:\n` +
      `${JSON.stringify(components, null, 2)}`;

    super(message);

    this.components = components;
  }
}

export const isInconsistentTemporalVersioningSupportError = (
  error: unknown,
): error is InconsistentTemporalVersioningSupportError =>
  typeof error === "object" &&
  (error as InconsistentTemporalVersioningSupportError).kind ===
    "InconsistentTemporalVersioningSupportError";
