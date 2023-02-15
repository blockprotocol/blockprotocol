import { BaseUri, VersionedUri } from "@blockprotocol/type-system/slim";
import slugify from "slugify";

import { FRONTEND_URL } from "../../lib/config";

type OntologyKind = "entityType" | "propertyType";

export const generateOntologyUri = ({
  author,
  kind,
  title,
  version,
}: {
  author: `@${string}`;
  kind: OntologyKind;
  title: string;
  version: number;
}): { baseUri: BaseUri; versionedUri: VersionedUri } => {
  const baseUri: BaseUri = `${FRONTEND_URL}/${author}/types/${
    kind === "entityType" ? "entity-type" : "property-type"
  }/${slugify(title, {
    lower: true,
    strict: true,
  })}/`;
  const versionedUri = `${baseUri}v/${version}` as VersionedUri;

  return {
    baseUri,
    versionedUri,
  };
};
