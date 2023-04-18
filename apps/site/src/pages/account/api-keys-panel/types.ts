import { Dispatch, SetStateAction } from "react";

import { UserFacingApiKeyProperties } from "../../../lib/api/model/api-key.model";

export type ApiKeyProps = UserFacingApiKeyProperties;

export interface ApiKeyItemProps {
  fullKeyValue?: string;
  apiKey: ApiKeyProps;
}

export interface ApiKeysContextValue {
  apiKeys: ApiKeyProps[];
  setApiKeys: Dispatch<SetStateAction<ApiKeyProps[]>>;
  isCreatingNewKey: boolean;
  setIsCreatingNewKey: Dispatch<SetStateAction<boolean>>;
  newlyCreatedKeyIds: string[];
  setNewlyCreatedKeyIds: Dispatch<SetStateAction<string[]>>;
  fetchAndSetApiKeys: () => Promise<void>;
  revokeApiKey: (publicId: string) => Promise<void>;
  renameApiKey: (publicId: string, displayName: string) => Promise<void>;
}
