import { Entity } from "@blockprotocol/graph";
import { extractBaseUri } from "@blockprotocol/type-system/slim";

import { entityTypes } from "./entity-types";
import { propertyTypes } from "./property-types";
import { companyNames, personNames } from "./words";

const createPerson = (entityId: number): Entity => {
  const name = personNames[entityId] ?? "Unknown Person";
  return {
    metadata: {
      recordId: {
        baseId: `person-${entityId.toString()}`,
        versionId: new Date().toISOString(),
      },
      entityTypeId: entityTypes.person.$id,
    },
    properties: {
      [extractBaseUri(propertyTypes.age.$id)]: Math.ceil(Math.random() * 100),
      [extractBaseUri(propertyTypes.email.$id)]: `${name}@example.com`,
      [extractBaseUri(propertyTypes.name.$id)]: name,
      [extractBaseUri(propertyTypes.username.$id)]: name.toLowerCase(),
    },
  };
};

const createCompany = (entityId: number): Entity => {
  const name = companyNames[entityId] ?? "Unknown Company";
  return {
    metadata: {
      recordId: {
        baseId: `company-${entityId.toString()}`,
        versionId: new Date().toISOString(),
      },
      entityTypeId: entityTypes.company.$id,
    },
    properties: {
      [extractBaseUri(propertyTypes.numberOfEmployees.$id)]: Math.ceil(
        Math.random() * 10_000,
      ),
      [extractBaseUri(propertyTypes.name.$id)]: name,
    },
  };
};

const createWorksForLink = (
  sourceEntityId: string,
  destinationEntityId: string,
): Entity => {
  return {
    metadata: {
      recordId: {
        baseId: `${sourceEntityId}-works-for-${destinationEntityId}`,
        versionId: new Date().toISOString(),
      },
      entityTypeId: entityTypes.worksFor.$id,
    },
    properties: {},
    linkData: {
      leftEntityId: sourceEntityId,
      rightEntityId: destinationEntityId,
    },
  };
};

const createFounderOfLink = (
  sourceEntityId: string,
  destinationEntityId: string,
): Entity => {
  return {
    metadata: {
      recordId: {
        baseId: `${sourceEntityId}-founder-of-${destinationEntityId}`,
        versionId: new Date().toISOString(),
      },
      entityTypeId: entityTypes.founderOf.$id,
    },
    properties: {},
    linkData: {
      leftEntityId: sourceEntityId,
      rightEntityId: destinationEntityId,
    },
  };
};

const createEntities = (): Entity[] => {
  // First create people and companies in separate lists
  const people = [];
  const companies = [];

  for (let idx = 0; idx < personNames.length; idx++) {
    people.push(createPerson(idx));
  }
  for (let idx = 0; idx < companyNames.length; idx++) {
    companies.push(createCompany(idx));
  }

  const entities = [];

  // For each company, `pop` (to avoid double selection in the next step) a person to be the founder, and start building
  // the final entities list
  for (const company of companies) {
    const founder = people.pop();

    if (founder) {
      entities.push(
        createFounderOfLink(
          founder.metadata.recordId.baseId,
          company.metadata.recordId.baseId,
        ),
      );
      entities.push(founder);
    }
  }
  for (const person of people) {
    entities.push(
      createWorksForLink(
        person.metadata.recordId.baseId,
        companies[Math.floor(Math.random() * companies.length)]!.metadata
          .recordId.baseId,
      ),
    );
  }

  return [...entities, ...people, ...companies];
};

const entities = createEntities();

export { entities };
