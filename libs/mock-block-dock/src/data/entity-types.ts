import {
  ENTITY_TYPE_META_SCHEMA,
  EntityType,
  extractBaseUrl,
} from "@blockprotocol/graph";

import { propertyTypes } from "./property-types";

const worksFor: EntityType = {
  $schema: ENTITY_TYPE_META_SCHEMA,
  kind: "entityType",
  $id: "https://example.com/types/entity-type/works-for/v/1",
  type: "object",
  title: "Works For",
  description: "Has employment at this entity.",
  allOf: [
    {
      $ref: "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1",
    },
  ],
  properties: {},
  required: [],
};
const founderOf: EntityType = {
  $schema: ENTITY_TYPE_META_SCHEMA,
  kind: "entityType",
  $id: "https://example.com/types/entity-type/founder-of/v/1",
  type: "object",
  title: "Founder of",
  description: "Established this entity.",
  allOf: [
    {
      $ref: "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1",
    },
  ],
  properties: {},
  required: [],
};
const company: EntityType = {
  $schema: ENTITY_TYPE_META_SCHEMA,
  kind: "entityType",
  $id: "https://example.com/types/entity-type/company/v/1",
  type: "object",
  title: "Company",
  description: "A company or organization.",
  properties: {
    [extractBaseUrl(propertyTypes.numberOfEmployees.$id)]: {
      $ref: propertyTypes.numberOfEmployees.$id,
    },
    [extractBaseUrl(propertyTypes.name.$id)]: {
      $ref: propertyTypes.name.$id,
    },
  },
  required: [
    extractBaseUrl(propertyTypes.numberOfEmployees.$id),
    extractBaseUrl(propertyTypes.name.$id),
  ],
  links: {},
};
const person: EntityType = {
  $schema: ENTITY_TYPE_META_SCHEMA,
  kind: "entityType",
  $id: "https://example.com/types/entity-type/person/v/1",
  type: "object",
  title: "Person",
  description: "A human person.",
  properties: {
    [extractBaseUrl(propertyTypes.age.$id)]: {
      $ref: propertyTypes.age.$id,
    },
    [extractBaseUrl(propertyTypes.email.$id)]: {
      $ref: propertyTypes.email.$id,
    },
    [extractBaseUrl(propertyTypes.name.$id)]: {
      $ref: propertyTypes.name.$id,
    },
    [extractBaseUrl(propertyTypes.username.$id)]: {
      $ref: propertyTypes.username.$id,
    },
  },
  required: [
    extractBaseUrl(propertyTypes.age.$id),
    extractBaseUrl(propertyTypes.email.$id),
    extractBaseUrl(propertyTypes.name.$id),
    extractBaseUrl(propertyTypes.username.$id),
  ],
  links: {
    [worksFor.$id]: {
      type: "array",
      items: {
        oneOf: [{ $ref: company.$id }],
      },
      ordered: false,
    },
    [founderOf.$id]: {
      type: "array",
      items: {
        oneOf: [{ $ref: company.$id }],
      },
      ordered: false,
    },
  },
};
const testType: EntityType = {
  $schema: ENTITY_TYPE_META_SCHEMA,
  kind: "entityType",
  $id: "https://example.com/types/entity-type/test-type/v/1",
  type: "object",
  title: "Test Type",
  description: "A Type for Testing",
  properties: {
    [extractBaseUrl(propertyTypes.name.$id)]: {
      $ref: propertyTypes.name.$id,
    },
  },
  required: [extractBaseUrl(propertyTypes.name.$id)],
  links: {},
};

export const entityTypes = {
  company,
  person,
  worksFor,
  founderOf,
  testType,
};
// satisfies Record<string, EntityType> };
