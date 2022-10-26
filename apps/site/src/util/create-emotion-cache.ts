import _createCache from "@emotion/cache";

const createCache = _createCache as unknown as typeof _createCache.default;

export const createEmotionCache = () => createCache({ key: "css" });
