export const FRONTEND_DOMAIN =
  process.env.FRONTEND_DOMAIN ??
  process.env.NEXT_PUBLIC_VERCEL_URL ??
  "localhost:3000";

export const USE_HTTPS = process.env.NODE_ENV !== "development";

export const FRONTEND_URL = `http${USE_HTTPS ? "s" : ""}://${FRONTEND_DOMAIN}`;

export const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
