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
  apiKey: ApiKeyProps;
  // @todo move into context
  onRevoke: (publicId: string) => Promise<void>;
  onRename: (publicId: string, displayName: string) => Promise<void>;
}

export interface ApiKeysContextValue {
  // @todo remove from context
  apiKeys: ApiKeyProps[];
  setApiKeys: Dispatch<SetStateAction<ApiKeyProps[]>>;
  // @todo remove – move into ApiKeyProps
  newlyCreatedKeyIds: string[];
  setNewlyCreatedKeyIds: Dispatch<SetStateAction<string[]>>;
  fetchAndSetApiKeys: () => Promise<void>;
}
