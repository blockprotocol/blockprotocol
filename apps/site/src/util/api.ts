import { ErrorResponse } from "../lib/api/handler/base-handler.js";

export const mustGetEnvVar = (name: string) => {
  const environmentVariable = process.env[name];

  if (!environmentVariable) {
    throw new Error(`"${name}" environment variable is not defined`);
  }

  return environmentVariable;
};

export const formatErrors = (...errors: ErrorResponse["errors"]) => ({
  errors,
});

const isObjectWithKey = <K extends PropertyKey>(
  thing: unknown,
  key: K,
): thing is Record<K, unknown> =>
  typeof thing === "object" && thing !== null && key in thing;

export const isErrorContainingCauseWithCode = (
  error: unknown,
): error is Error & { cause: { code: string } } =>
  error instanceof Error &&
  isObjectWithKey(error.cause, "code") &&
  typeof error.cause.code === "string";

export const RESTRICTED_SHORTNAMES = [
  "-",
  ".well-known",
  "404.html",
  "422.html",
  "500.html",
  "502.html",
  "503.html",
  "abuse_reports",
  "admin",
  "ag",
  "api",
  "apple-touch-icon-precomposed.png",
  "apple-touch-icon.png",
  "assets",
  "autocomplete",
  "bh",
  "bhg",
  "dashboard",
  "deploy.html",
  "dw",
  "example",
  "explore",
  "favicon.ico",
  "favicon.png",
  "files",
  "groups",
  "health_check",
  "help",
  "import",
  "invites",
  "jwt",
  "local",
  "login",
  "oauth",
  "org",
  "profile",
  "projects",
  "public",
  "robots.txt",
  "s",
  "search",
  "sent_notifications",
  "slash-command-logo.png",
  "snippets",
  "unsubscribes",
  "uploads",
  "user",
  "users",
  "v2",
];
