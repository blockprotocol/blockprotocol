import { GraphBlockHandler } from "@blockprotocol/graph";

import { useRefreshDataContext } from "../contexts/refresh-data";

export const useDeleteEntity = (graphModule: GraphBlockHandler) => {
  const { sendRefreshSignal } = useRefreshDataContext();

  const deleteEntity = async (entityId: string) => {
    const { errors } = await graphModule.deleteEntity({
      data: {
        entityId,
      },
    });

    if (errors && errors.length > 0) {
      throw new Error(
        `Errors in \`deleteEntity\` response: ${JSON.stringify(
          errors,
          null,
          2,
        )}`,
      );
    }

    sendRefreshSignal();
  };

  return {
    deleteEntity,
  };
};
