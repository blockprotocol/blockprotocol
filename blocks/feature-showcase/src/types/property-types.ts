import { CompanyProperties, PersonProperties } from "./generated/shared";

export const propertyTypeBaseUrls = {
  name: "https://blockprotocol.org/@blockprotocol/types/property-type/name/",
  email: "https://blockprotocol.org/@examples/types/property-type/e-mail/",
} as const satisfies Record<
  string,
  keyof (CompanyProperties & PersonProperties)
>;
