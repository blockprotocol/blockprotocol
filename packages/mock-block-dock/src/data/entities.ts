import { BlockProtocolEntity } from "blockprotocol";

import { companyNames, personNames } from "./words";

const entities: BlockProtocolEntity[] = [];

const NUMBER_OF_ENTITIES_TO_CREATE = Math.min(
  personNames.length,
  companyNames.length,
);

const createPerson = (entityId: number): BlockProtocolEntity => {
  const now = new Date();
  const name = personNames[entityId];
  return {
    entityId: `person-${entityId.toString()}`,
    timestamps: {
      createdAt: now,
      updatedAt: now,
    },
    properties: {
      age: Math.ceil(Math.random() * 100),
      email: {
        address: `${name}@example.com`,
        primary: true,
      },
      name,
      username: name.toLowerCase(),
    },
  };
};

const createCompany = (entityId: number): BlockProtocolEntity => {
  const now = new Date();
  const name = companyNames[entityId];
  return {
    entityId: entityId.toString(),
    timestamps: {
      createdAt: now,
      updatedAt: now,
    },
    properties: {
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
