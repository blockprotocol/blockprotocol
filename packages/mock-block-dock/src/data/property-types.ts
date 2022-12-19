import { PropertyType } from "@blockprotocol/graph";

const numberOfEmployees: PropertyType = {
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
  kind: "propertyType",
  $id: "http://example.com/types/property-type/username/v/1",
  title: "Username",
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
};
// satisfies Record<string, PropertyType>;
