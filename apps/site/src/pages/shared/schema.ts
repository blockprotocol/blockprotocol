import { BaseUrl, VersionedUrl } from "@blockprotocol/type-system/slim";
import slugify from "slugify";

import { FRONTEND_URL } from "../../lib/config";

type OntologyKind = "entityType" | "propertyType";

export const generateOntologyUrl = ({
  author,
  kind,
  title,
  version,
}: {
  author: `@${string}`;
  kind: OntologyKind;
  title: string;
  version: number;
}): { baseUrl: BaseUrl; versionedUrl: VersionedUrl } => {
  const baseUrl: BaseUrl = `${FRONTEND_URL}/${author}/types/${
    kind === "entityType" ? "entity-type" : "property-type"
  }/${slugify(title, {
    lower: true,
    strict: true,
  })}/`;
  const versionedUrl = `${baseUrl}v/${version}` as VersionedUrl;

  return {
    baseUrl,
    versionedUrl,
  };
};
