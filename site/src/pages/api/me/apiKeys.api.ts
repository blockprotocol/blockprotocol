import { createAuthenticatedHandler } from "../../../lib/handler/authenticatedHandler";
import { UserFacingApiKeyProperties } from "../../../lib/model/apiKey.model";

export type ApiKeysResponse = {
  apiKeysMetadata: UserFacingApiKeyProperties[];
};

export default createAuthenticatedHandler<undefined, ApiKeysResponse>(
  false,
).get(async (req, res) => {
  const { db, user } = req;

  const apiKeysMetadata = await user.apiKeys(db);

  res.status(200).json({ apiKeysMetadata });
});
