import { LinkData, VersionedUrl } from "@blockprotocol/graph";

import type { FoundedBy as FoundedByGen } from "./entity-types/organization.gen";
import type { EmployedBy as EmployedByGen } from "./entity-types/person.gen";

export type {
  Organization,
  OrganizationFoundedByLinks,
  OrganizationLinkAndRightEntities,
  OrganizationLinksByLinkTypeId,
  OrganizationProperties,
} from "./entity-types/organization.gen";
export type {
  Person,
  PersonEmployedByLinks,
  PersonLinkAndRightEntities,
  PersonLinksByLinkTypeId,
  PersonProperties,
} from "./entity-types/person.gen";

/* @todo - type gen should be updated to affirm this */
export type FoundedBy = FoundedByGen & { linkData: LinkData };
export type EmployedBy = EmployedByGen & { linkData: LinkData };

export const entityTypeIds = {
  person:
    "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/person/v/3",
  organization:
    "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/organization/v/2",
  employedBy:
    "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/employed-by/v/1",
  foundedBy:
    "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/founded-by/v/1",
} as const satisfies Record<string, VersionedUrl>;
