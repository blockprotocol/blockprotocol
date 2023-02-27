import { GraphBlockHandler, VersionedUrl } from "@blockprotocol/graph";
import { FunctionComponent, useState } from "react";

import {
  LinkKind,
  useCreatePersonOrgLink,
} from "../../hooks/use-create-person-org-link";
import { useGetAllOrganizationEntities } from "../../hooks/use-get-all-organization-entities";
import { useGetAllPersonEntities } from "../../hooks/use-get-all-person-entities";
import { entityTypeIds } from "../../types/entity-types";
import { propertyTypeBaseUrls } from "../../types/property-types";

type LinkFactoryProps = {
  graphModule: GraphBlockHandler;
};

const prettifyLinkKind = (linkKind: LinkKind) => {
  if (linkKind === "employedBy") {
    return "Employed By";
  } else if (linkKind === "foundedBy") {
    return "Founded By";
  }
  throw new Error(`Unknown link kind: ${linkKind}`);
};

const prettifyLinkTypeId = (linkTypeId: VersionedUrl) => {
  if (linkTypeId === entityTypeIds.employedBy) {
    return "Employed By";
  } else if (linkTypeId === entityTypeIds.foundedBy) {
    return "Founded By";
  }
  throw new Error(
    `Implementation error, unsupported link type ID: ${linkTypeId}`,
  );
};

export const LinkFactory: FunctionComponent<LinkFactoryProps> = ({
  graphModule,
}) => {
  const { createLink, previousCreatedLink } =
    useCreatePersonOrgLink(graphModule);

  const personEntities = useGetAllPersonEntities(graphModule);
  const organizationEntities = useGetAllOrganizationEntities(graphModule);

  const [linkKind, setLinkKind] = useState<LinkKind | null>(null);
  const [leftEntityId, setLeftEntityId] = useState<string | null>(null);
  const [rightEntityId, setRightEntityId] = useState<string | null>(null);

  const personEntityIdOptions = (personEntities ?? []).map((personEntity) => (
    <option
      key={JSON.stringify(personEntity.metadata.recordId)}
      value={personEntity.metadata.recordId.entityId}
    >
      {personEntity.properties[propertyTypeBaseUrls.name] ?? "Unknown Person"}
    </option>
  ));

  const organizationEntityIdOptions = (organizationEntities ?? []).map(
    (organizationEntity) => (
      <option
        key={JSON.stringify(organizationEntity.metadata.recordId)}
        value={organizationEntity.metadata.recordId.entityId}
      >
        {organizationEntity.properties[propertyTypeBaseUrls.name] ??
          "Unknown Organization"}
      </option>
    ),
  );

  const leftEntityOptions =
    linkKind === "employedBy"
      ? personEntityIdOptions
      : linkKind === "foundedBy"
      ? organizationEntityIdOptions
      : [];
  const rightEntityOptions =
    linkKind === "employedBy"
      ? organizationEntityIdOptions
      : linkKind === "foundedBy"
      ? personEntityIdOptions
      : [];

  const linkSelector = (
    <select
      onChange={(changeEvent) => {
        const kind = changeEvent.target.value as LinkKind | undefined;
        setLinkKind(kind ?? null);
      }}
    >
      <option value={undefined}>Select Link Type</option>
      <option value="employedBy" onClick={() => setLinkKind("employedBy")}>
        Employed By
      </option>
      <option value="foundedBy" onClick={() => setLinkKind("foundedBy")}>
        Founded By
      </option>
    </select>
  );

  const sourceSelector = (
    <select
      disabled={linkKind === null || leftEntityOptions.length === 0}
      onChange={(changeEvent) =>
        setLeftEntityId(changeEvent.target.value ?? null)
      }
    >
      <option value={undefined} selected={leftEntityId === null}>
        {linkKind === null
          ? "Select Source Entity"
          : linkKind === "foundedBy"
          ? leftEntityOptions.length === 0
            ? "No Organization entities found"
            : "Select Organization"
          : leftEntityOptions.length === 0
          ? "No Person entities found"
          : "Select Person"}
      </option>
      {leftEntityOptions}
    </select>
  );

  const targetSelector = (
    <select
      disabled={linkKind === null || rightEntityOptions.length === 0}
      onChange={(changeEvent) =>
        setRightEntityId(changeEvent.target.value ?? null)
      }
    >
      <option value={undefined} selected={rightEntityId === null}>
        {linkKind === null
          ? "Select Target Entity"
          : linkKind === "foundedBy"
          ? leftEntityOptions.length === 0
            ? "No Person entities found"
            : "Select Person"
          : leftEntityOptions.length === 0
          ? "No Organization entities found"
          : "Select Organization"}
      </option>
      {rightEntityOptions}
    </select>
  );

  const submitButton = (
    <button
      type="button"
      disabled={
        linkKind === null || leftEntityId === null || rightEntityId === null
      }
      onClick={async () => {
        if (
          linkKind === null ||
          leftEntityId === null ||
          rightEntityId === null
        ) {
          throw new Error(
            "Implementation error, should not be able to click button without all values being set.",
          );
        }

        await createLink(leftEntityId, rightEntityId, linkKind);

        setLeftEntityId(null);
        setRightEntityId(null);
      }}
    >
      {`Create ${linkKind ? prettifyLinkKind(linkKind) : ""} Link`}
    </button>
  );

  /* @todo - This is fairly inefficient */
  const getNameForEntityId = (entityId: string) => {
    const personOrOrg = [
      ...(personEntities ?? []),
      ...(organizationEntities ?? []),
    ].find((entity) => entity.metadata.recordId.entityId === entityId);

    return personOrOrg?.properties[propertyTypeBaseUrls.name] ?? "Unknown Name";
  };

  return (
    <div>
      {linkSelector}
      {sourceSelector}
      {targetSelector}
      {submitButton}
      <div>
        {previousCreatedLink
          ? /* @todo - Get the name of the endpoint entities */
            `Created: ${getNameForEntityId(
              previousCreatedLink.linkData.leftEntityId,
            )} -${prettifyLinkTypeId(
              previousCreatedLink.metadata.entityTypeId,
            )}-> ${getNameForEntityId(
              previousCreatedLink.linkData.rightEntityId,
            )}`
          : "No link created yet."}
      </div>
    </div>
  );
};
