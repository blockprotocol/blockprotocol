import { Dispatch, ReactElement, SetStateAction } from "react";

import { UserFacingApiKeyProperties } from "../../../lib/api/model/api-key.model";

export type ApiKeyProps = UserFacingApiKeyProperties;

export type KeyAction = "rename" | "revoke";

export type KeyActionStatus =
  | {
      publicId: string;
      action: KeyAction;
    }
  | undefined;

export interface ApiKeyItemProps {
  renameApiKeyCard: ReactElement;
  revokeApiKeyCard: ReactElement;
  fullKeyValue?: string;
  apiKey: ApiKeyProps;
  keyAction?: KeyAction;
}

export interface ApiKeysContextValue {
  apiKeys: ApiKeyProps[];
  setApiKeys: Dispatch<SetStateAction<ApiKeyProps[]>>;
  isCreatingNewKey: boolean;
  setIsCreatingNewKey: Dispatch<SetStateAction<boolean>>;
  newlyCreatedKeyIds: string[];
  setNewlyCreatedKeyIds: Dispatch<SetStateAction<string[]>>;
  keyActionStatus: KeyActionStatus;
  setKeyActionStatus: Dispatch<SetStateAction<KeyActionStatus>>;
  fetchAndSetApiKeys: () => Promise<void>;
  revokeApiKey: (publicId: string) => Promise<void>;
  renameApiKey: (publicId: string, displayName: string) => Promise<void>;
}
