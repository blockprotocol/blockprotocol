export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL
  ? process.env.NEXT_PUBLIC_FRONTEND_URL
  : process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";

export const isUsingHttps = new URL(FRONTEND_URL).protocol === "https";

export const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

export const isFork =
  process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER &&
  process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER !== "blockprotocol";
