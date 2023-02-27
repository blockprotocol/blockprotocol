import { OrganizationProperties } from "./entity-types/organization.gen";
import { PersonProperties } from "./entity-types/person.gen";

export const propertyTypeBaseUrls = {
  name: "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/name/",
  website:
    "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/website/",
  avatar:
    "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/avatar/",
  email:
    "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/e-mail/",
} as const satisfies Record<
  string,
  keyof (OrganizationProperties & PersonProperties)
>;
