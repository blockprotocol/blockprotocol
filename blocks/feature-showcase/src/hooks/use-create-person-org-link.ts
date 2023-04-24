import { GraphBlockHandler } from "@blockprotocol/graph";
import { useState } from "react";

import { useRefreshDataContext } from "../contexts/refresh-data";
import { EmployedBy, entityTypeIds, FoundedBy } from "../types/entity-types";

export type LinkKind = "employedBy" | "foundedBy";

export type CreatePersonOrgLink = <Kind extends LinkKind>(
  sourceEntityId: string,
  targetEntityId: string,
  kind: Kind,
) => Promise<Kind extends "employedBy" ? EmployedBy : FoundedBy>;

export const useCreatePersonOrgLink = (
  graphModule: GraphBlockHandler,
): {
  createLink: CreatePersonOrgLink;
  previousCreatedLink: EmployedBy | FoundedBy | null;
} => {
  const { sendRefreshSignal } = useRefreshDataContext();

  const [previousCreatedLink, setPreviousCreatedLink] = useState<
    EmployedBy | FoundedBy | null
  >(null);

  const createLink = async <Kind extends LinkKind>(
    sourceEntityId: string,
    targetEntityId: string,
    kind: LinkKind,
  ) => {
    const { data, errors } = await graphModule.createEntity({
      data: {
        entityTypeId: entityTypeIds[kind],
        properties: {},
        linkData: {
          leftEntityId: sourceEntityId,
          rightEntityId: targetEntityId,
        },
      },
    });

    if (!data) {
      throw new Error(
        `No data in \`createEntity\` response: ${JSON.stringify(
          errors,
          null,
          2,
        )}`,
      );
    }

    sendRefreshSignal();

    const link = data as Kind extends "employedBy" ? EmployedBy : FoundedBy;

    setPreviousCreatedLink(link);

    return link;
  };

  return {
    createLink,
    previousCreatedLink,
  };
};
