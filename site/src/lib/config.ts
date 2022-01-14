export const FRONTEND_DOMAIN =
  process.env.FRONTEND_DOMAIN ??
  process.env.NEXT_PUBLIC_VERCEL_URL ??
  "localhost:3000";

export const FRONTEND_URL = `http${
  FRONTEND_DOMAIN.startsWith("localhost") ? "" : "s"
}//${FRONTEND_DOMAIN}`;

export const USE_HTTPS = process.env.NODE_ENV !== "development";
