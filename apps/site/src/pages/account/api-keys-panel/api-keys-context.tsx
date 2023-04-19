import { createContext, useContext } from "react";

import { ApiKeysContextValue } from "./types";

export const ApiKeysContext = createContext<ApiKeysContextValue | null>(null);

export const useApiKeys = () => {
  const contextValue = useContext(ApiKeysContext);

  if (!contextValue) {
    throw new Error("No api keys context value has been provided");
  }

  return contextValue;
};
