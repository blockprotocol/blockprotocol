import { EntityRecordId } from "@blockprotocol/graph";

import {
  Company,
  EmployedBy,
  entityTypeIds,
  Person,
} from "./types/entity-types";
import { BlockEntity } from "./types/generated/block-entity";
import { FoundedBy } from "./types/generated/shared";
import { propertyTypeBaseUrls } from "./types/property-types";

const randomRecordId = (): EntityRecordId => {
  return {
    entityId: Math.random().toString(36).substring(2, 15),
    editionId: new Date().toISOString(),
  };
};

export const blockEntity: BlockEntity = {
  metadata: {
    recordId: randomRecordId(),
    entityTypeId: entityTypeIds.thing,
  },
  properties: {
    [propertyTypeBaseUrls.name]: "World",
  },
};

const personEntities = {
  alice: {
    metadata: {
      recordId: randomRecordId(),
      entityTypeId: entityTypeIds.person,
    },
    properties: {
      [propertyTypeBaseUrls.name]: "Alice Coffman",
    },
  },
  bob: {
    metadata: {
      recordId: randomRecordId(),
      entityTypeId: entityTypeIds.person,
    },
    properties: {
      [propertyTypeBaseUrls.name]: "Bob Lambert",
    },
  },
} as const satisfies Record<string, Person>;

const companyEntities = {
  tyrellIndustries: {
    metadata: {
      recordId: randomRecordId(),
      entityTypeId: entityTypeIds.company,
    },
    properties: {
      [propertyTypeBaseUrls.name]: "Tyrell Industries",
    },
  },
} as const satisfies Record<string, Company>;

const foundedByLinks: FoundedBy[] = [
  {
    metadata: {
      recordId: randomRecordId(),
      entityTypeId: entityTypeIds.foundedBy,
    },
    properties: {},
    linkData: {
      leftEntityId: companyEntities.tyrellIndustries.metadata.recordId.entityId,
      rightEntityId: personEntities.bob.metadata.recordId.entityId,
    },
  },
];

const employedByLinkEntities: EmployedBy[] = [
  {
    metadata: {
      recordId: randomRecordId(),
      entityTypeId: entityTypeIds.employedBy,
    },
    properties: {},
    linkData: {
      leftEntityId: personEntities.bob.metadata.recordId.entityId,
      rightEntityId:
        companyEntities.tyrellIndustries.metadata.recordId.entityId,
    },
  },
];

export const exampleGraph = {
  entities: [
    blockEntity,
    ...Object.values(personEntities),
    ...Object.values(companyEntities),
    ...employedByLinkEntities,
    ...foundedByLinks,
  ],
};

export default exampleGraph;
