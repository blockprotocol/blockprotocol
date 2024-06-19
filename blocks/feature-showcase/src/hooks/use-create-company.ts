import { GraphBlockHandler } from "@blockprotocol/graph";
import { useState } from "react";

import { useRefreshDataContext } from "../contexts/refresh-data";
import {
  Company,
  CompanyProperties,
  entityTypeIds,
} from "../types/entity-types";
import { propertyTypeBaseUrls } from "../types/property-types";

export const useCreateCompany = (
  graphModule: GraphBlockHandler,
): {
  createCompany: (name: string) => Promise<Company>;
  previousCreatedCompany: Company | null;
} => {
  const { sendRefreshSignal } = useRefreshDataContext();

  const [previousCreatedCompany, setPreviousCreatedCompany] =
    useState<Company | null>(null);

  const createCompany = async (name: string) => {
    const properties: CompanyProperties = {
      [propertyTypeBaseUrls.name]: name,
    };

    const { data, errors } = await graphModule.createEntity({
      data: {
        entityTypeId: entityTypeIds.company,
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

    const company = data as Company;

    setPreviousCreatedCompany(company);

    return company;
  };

  return {
    createCompany,
    previousCreatedCompany,
  };
};
