import { GraphBlockHandler } from "@blockprotocol/graph";
import { useState } from "react";

import { useRefreshDataContext } from "../contexts/refresh-data";
import { entityTypeIds } from "../types/entity-types";
import {
  Organization,
  OrganizationProperties,
} from "../types/entity-types/person.gen";
import { propertyTypeBaseUrls } from "../types/property-types";

export const useCreateOrganization = (
  graphModule: GraphBlockHandler,
): {
  createOrganization: (name: string) => Promise<Organization>;
  previousCreatedOrganization: Organization | null;
} => {
  const { sendRefreshSignal } = useRefreshDataContext();

  const [previousCreatedOrganization, setPreviousCreatedOrganization] =
    useState<Organization | null>(null);

  const createOrganization = async (name: string) => {
    const properties: OrganizationProperties = {
      [propertyTypeBaseUrls.name]: name,
    };

    const { data, errors } = await graphModule.createEntity({
      data: {
        entityTypeId: entityTypeIds.organization,
        properties,
      },
    });

    sendRefreshSignal();

    if (!data) {
      throw new Error(
        `No data in \`createEntity\` response: ${JSON.stringify(
          errors,
          null,
          2,
        )}`,
      );
    }

    const organization = data as Organization;

    setPreviousCreatedOrganization(organization);

    return organization;
  };

  return {
    createOrganization,
    previousCreatedOrganization,
  };
};
