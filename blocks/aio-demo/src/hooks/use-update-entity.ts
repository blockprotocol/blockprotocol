import {
  EntityPropertiesObject,
  GraphBlockHandler,
  validateVersionedUrl,
} from "@blockprotocol/graph";

import { useRefreshDataContext } from "../contexts/refresh-data";

export const useUpdateEntity = (graphModule: GraphBlockHandler) => {
  const { sendRefreshSignal } = useRefreshDataContext();

  const updateEntity = async (params: {
    entityId: string;
    entityTypeId: string;
    properties: EntityPropertiesObject;
  }) => {
    const { entityId, entityTypeId, properties } = params;

    const versionedUrlResult = validateVersionedUrl(entityTypeId);
    if (versionedUrlResult.type === "Err") {
      throw new Error(
        `Error in \`updateEntity\`, entity type id is invalid: ${versionedUrlResult.inner.reason}`,
      );
    }

    const { errors } = await graphModule.updateEntity({
      data: {
        entityId,
        entityTypeId: versionedUrlResult.inner,
        properties,
      },
    });

    if (errors && errors.length > 0) {
      throw new Error(
        `Errors in \`updateEntity\` response: ${JSON.stringify(
          errors,
          null,
          2,
        )}`,
      );
    }

    sendRefreshSignal();
  };

  return {
    updateEntity,
  };
};
