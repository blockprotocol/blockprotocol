import { VersionedUrl } from "@blockprotocol/graph";

export type {
  Company,
  CompanyFoundedByLink,
  CompanyOutgoingLinkAndTarget,
  CompanyOutgoingLinksByLinkEntityTypeId,
  CompanyProperties,
  FoundedBy,
} from "./generated/company";
export type {
  EmployedBy,
  Person,
  PersonEmployedByLink,
  PersonOutgoingLinkAndTarget,
  PersonOutgoingLinksByLinkEntityTypeId,
  PersonProperties,
} from "./generated/person";

export const entityTypeIds = {
  thing: "https://blockprotocol.org/@blockprotocol/types/entity-type/thing/v/2",
  person: "https://blockprotocol.org/@examples/types/entity-type/person/v/1",
  company: "https://blockprotocol.org/@examples/types/entity-type/company/v/1",
  employedBy:
    "https://blockprotocol.org/@examples/types/entity-type/employed-by/v/1",
  foundedBy:
    "https://blockprotocol.org/@examples/types/entity-type/founded-by/v/1",
} as const satisfies Record<string, VersionedUrl>;
