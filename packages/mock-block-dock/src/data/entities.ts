import { Entity } from "@blockprotocol/graph";

import { companyNames, personNames } from "./words";

const entities: Entity[] = [];

const NUMBER_OF_ENTITIES_TO_CREATE = Math.min(
  personNames.length,
  companyNames.length,
);

const createPerson = (entityId: number): Entity => {
  const now = new Date();
  const name = personNames[entityId] ?? "Unknown Person";
  return {
    entityId: `person-${entityId.toString()}`,
    entityTypeId: "Person",
    properties: {
      createdAt: now,
      updatedAt: now,
      age: Math.ceil(Math.random() * 100),
      email: `${name}@example.com`,
      name,
      username: name.toLowerCase(),
    },
  };
};

const createCompany = (entityId: number): Entity => {
  const now = new Date();
  const name = companyNames[entityId];
  return {
    entityId: `company-${entityId.toString()}`,
    entityTypeId: "Company",
    properties: {
      createdAt: now,
      updatedAt: now,
      employees: Math.ceil(Math.random() * 10_000),
      name,
    },
  };
};

for (let id = 0; id < NUMBER_OF_ENTITIES_TO_CREATE; id++) {
  entities.push(createCompany(id));
  entities.push(createPerson(id));
}

export { entities };
