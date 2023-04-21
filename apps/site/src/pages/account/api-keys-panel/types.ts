import { UserFacingApiKeyProperties } from "../../../lib/api/model/api-key.model";

export type ApiKeyProps = UserFacingApiKeyProperties;

export interface ApiKeyItemProps {
  fullKeyValue?: string;
  apiKey: ApiKeyProps;
}

export interface ApiKeysContextValue {
  revokeApiKey: (publicId: string) => Promise<void>;
  renameApiKey: (publicId: string, displayName: string) => Promise<void>;
}
