import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { UserFacingApiKeyProperties } from "../../../lib/api/model/api-key.model";

export type KeyActionStatus =
  | {
      publicId: string;
      action: "rename" | "revoke";
    }
  | undefined;

export interface ApiKeysContextValue {
  apiKeys: UserFacingApiKeyProperties[];
  setApiKeys: Dispatch<SetStateAction<UserFacingApiKeyProperties[]>>;
  isCreatingNewKey: boolean;
  setIsCreatingNewKey: Dispatch<SetStateAction<boolean>>;
  newlyCreatedKeyIds: string[];
  setNewlyCreatedKeyIds: Dispatch<SetStateAction<string[]>>;
  keyActionStatus: KeyActionStatus;
  setKeyActionStatus: Dispatch<SetStateAction<KeyActionStatus>>;
  fetchAndSetApiKeys: () => Promise<void>;
}

export const ApiKeysContext = createContext<ApiKeysContextValue | null>(null);

export const useApiKeys = () => {
  const contextValue = useContext(ApiKeysContext);

  if (!contextValue) {
    throw new Error("No api keys context value has been provided");
  }

  return contextValue;
};
