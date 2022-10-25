import createCache from "@emotion/cache";

export const createEmotionCache = () =>
  (createCache as unknown as typeof createCache.default)({ key: "css" });
