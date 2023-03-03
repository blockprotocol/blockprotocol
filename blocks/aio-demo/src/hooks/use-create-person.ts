import { GraphBlockHandler } from "@blockprotocol/graph";
import { useState } from "react";

import { useRefreshDataContext } from "../contexts/refresh-data";
import { PersonNameParams } from "../shared/random-name";
import { entityTypeIds, Person, PersonProperties } from "../types/entity-types";
import { propertyTypeBaseUrls } from "../types/property-types";

export const useCreatePerson = (
  graphModule: GraphBlockHandler,
): {
  createPerson: (nameParams: PersonNameParams) => Promise<Person>;
  previousCreatedPerson: Person | null;
} => {
  const { sendRefreshSignal } = useRefreshDataContext();

  const [previousCreatedPerson, setPreviousCreatedPerson] =
    useState<Person | null>(null);

  const createPerson = async (nameParams: PersonNameParams) => {
    const properties: PersonProperties = {
      [propertyTypeBaseUrls.name]: `${nameParams.firstName} ${nameParams.lastName}`,
    };

    const { data, errors } = await graphModule.createEntity({
      data: {
        entityTypeId: entityTypeIds.person,
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

    const person = data as Person;

    setPreviousCreatedPerson(person);

    return person;
  };

  return {
    createPerson,
    previousCreatedPerson,
  };
};
