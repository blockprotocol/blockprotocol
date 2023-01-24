import { EntityType } from "@blockprotocol/graph";
import { extractBaseUri } from "@blockprotocol/type-system/slim";

import { propertyTypes } from "./property-types";

const worksFor: EntityType = {
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
  kind: "entityType",
  $id: "https://example.com/types/entity-type/company/v/1",
  type: "object",
  title: "Company",
  description: "A company or organization.",
  properties: {
    [extractBaseUri(propertyTypes.numberOfEmployees.$id)]: {
      $ref: propertyTypes.numberOfEmployees.$id,
    },
    [extractBaseUri(propertyTypes.name.$id)]: {
      $ref: propertyTypes.name.$id,
    },
  },
  required: [
    extractBaseUri(propertyTypes.numberOfEmployees.$id),
    extractBaseUri(propertyTypes.name.$id),
  ],
  links: {},
};
const person: EntityType = {
  kind: "entityType",
  $id: "https://example.com/types/entity-type/person/v/1",
  type: "object",
  title: "Person",
  description: "A human person.",
  properties: {
    [extractBaseUri(propertyTypes.age.$id)]: {
      $ref: propertyTypes.age.$id,
    },
    [extractBaseUri(propertyTypes.email.$id)]: {
      $ref: propertyTypes.email.$id,
    },
    [extractBaseUri(propertyTypes.name.$id)]: {
      $ref: propertyTypes.name.$id,
    },
    [extractBaseUri(propertyTypes.username.$id)]: {
      $ref: propertyTypes.username.$id,
    },
  },
  required: [
    extractBaseUri(propertyTypes.age.$id),
    extractBaseUri(propertyTypes.email.$id),
    extractBaseUri(propertyTypes.name.$id),
    extractBaseUri(propertyTypes.username.$id),
  ],
  links: {
    [worksFor.$id]: {
      type: "array",
      items: {
        $ref: company.$id,
      },
      ordered: false,
    },
    [founderOf.$id]: {
      type: "array",
      items: {
        $ref: company.$id,
      },
      ordered: false,
    },
  },
};
const testType: EntityType = {
  kind: "entityType",
  $id: "https://example.com/types/entity-type/test-type/v/1",
  type: "object",
  title: "Test Type",
  description: "A Type for Testing",
  properties: {
    [extractBaseUri(propertyTypes.name.$id)]: {
      $ref: propertyTypes.name.$id,
    },
  },
  required: [extractBaseUri(propertyTypes.name.$id)],
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
