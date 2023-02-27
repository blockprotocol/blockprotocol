import { PROPERTY_TYPE_META_SCHEMA, PropertyType } from "@blockprotocol/graph";

const numberOfEmployees: PropertyType = {
  $schema: PROPERTY_TYPE_META_SCHEMA,
  kind: "propertyType",
  $id: "http://example.com/types/property-type/number-of-employees/v/1",
  title: "Number of Employees",
  oneOf: [
    {
      $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
    },
  ],
};
const name: PropertyType = {
  $schema: PROPERTY_TYPE_META_SCHEMA,
  kind: "propertyType",
  $id: "http://example.com/types/property-type/name/v/1",
  title: "Name",
  oneOf: [
    {
      $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
    },
  ],
};
const age: PropertyType = {
  $schema: PROPERTY_TYPE_META_SCHEMA,
  kind: "propertyType",
  $id: "http://example.com/types/property-type/age/v/1",
  title: "Age",
  oneOf: [
    {
      $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
    },
  ],
};
const email: PropertyType = {
  $schema: PROPERTY_TYPE_META_SCHEMA,
  kind: "propertyType",
  $id: "http://example.com/types/property-type/email/v/1",
  title: "E-Mail",
  oneOf: [
    {
      $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
    },
  ],
};
const username: PropertyType = {
  $schema: PROPERTY_TYPE_META_SCHEMA,
  kind: "propertyType",
  $id: "http://example.com/types/property-type/username/v/1",
  title: "Username",
  oneOf: [
    {
      $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
    },
  ],
};
const description: PropertyType = {
  $schema: PROPERTY_TYPE_META_SCHEMA,
  kind: "propertyType",
  $id: "http://example.com/types/property-type/description/v/1",
  title: "An explanation of this thing",
  oneOf: [
    {
      $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
    },
  ],
};

export const propertyTypes = {
  numberOfEmployees,
  name,
  age,
  email,
  username,
  description,
};
// satisfies Record<string, PropertyType>;
