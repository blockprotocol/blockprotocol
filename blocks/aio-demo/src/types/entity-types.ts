import { VersionedUrl } from "@blockprotocol/graph";

export type {
  Company,
  CompanyFoundedByLinks,
  CompanyOutgoingLinkAndTarget,
  CompanyOutgoingLinksByLinkEntityTypeId,
  CompanyProperties,
  EmployedBy,
  FoundedBy,
  Person,
  PersonEmployedByLinks,
  PersonOutgoingLinkAndTarget,
  PersonOutgoingLinksByLinkEntityTypeId,
  PersonProperties,
} from "./generated/shared";

export const entityTypeIds = {
  person: "https://blockprotocol.org/@examples/types/entity-type/person/v/1",
  company: "https://blockprotocol.org/@examples/types/entity-type/company/v/1",
  employedBy:
    "https://blockprotocol.org/@examples/types/entity-type/employed-by/v/1",
  foundedBy:
    "https://blockprotocol.org/@examples/types/entity-type/founded-by/v/1",
} as const satisfies Record<string, VersionedUrl>;
