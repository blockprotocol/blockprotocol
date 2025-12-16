import { createAuthenticatedHandler } from "../../../lib/api/handler/authenticated-handler";
import { baseHandlerOptions } from "../../../lib/api/handler/base-handler";
import { UserFacingApiKeyProperties } from "../../../lib/api/model/api-key.model";

export type ApiKeysResponse = {
  apiKeysMetadata: UserFacingApiKeyProperties[];
};

export default createAuthenticatedHandler<undefined, ApiKeysResponse>()
  .get(async (req, res) => {
    const { db, user } = req;

    const apiKeysMetadata = await user.apiKeys(db);

    res.status(200).json({ apiKeysMetadata });
  })
  .handler(baseHandlerOptions);
