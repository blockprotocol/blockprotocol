import { GraphBlockHandler, VersionedUrl } from "@blockprotocol/graph";
import { FunctionComponent, useMemo, useState } from "react";

import { useDeleteEntity } from "../../hooks/use-delete-entity";
import { useGetAllEntities } from "../../hooks/use-get-all-entities";

type PersonFactoryProps = {
  graphModule: GraphBlockHandler;
};

export const EntityEraser: FunctionComponent<PersonFactoryProps> = ({
  graphModule,
}) => {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [selectedEntityTypeIdFilter, setSelectedEntityTypeIdFilter] =
    useState<VersionedUrl | null>(null);

  const { deleteEntity } = useDeleteEntity(graphModule);
  const allEntities = useGetAllEntities(graphModule);

  const filteredEntities = useMemo(
    () =>
      allEntities?.filter(
        (entity) =>
          selectedEntityTypeIdFilter === null ||
          entity.metadata.entityTypeId === selectedEntityTypeIdFilter,
      ),
    [allEntities, selectedEntityTypeIdFilter],
  );

  const entityTypeIds = useMemo(
    () =>
      new Set(allEntities?.map((entity) => entity.metadata.entityTypeId) ?? []),
    [allEntities],
  );

  /* @todo - With ontology hooks in MBD we could show the title of the entity type */
  const entityTypeIdOptions = useMemo(
    () =>
      [...entityTypeIds].map((entityTypeId) => (
        <option key={entityTypeId} value={entityTypeId}>
          {entityTypeId}
        </option>
      )),
    [entityTypeIds],
  );

  const entityOptions = useMemo(
    () =>
      (filteredEntities ?? []).map((entity) => (
        <option
          key={entity.metadata.recordId.entityId}
          value={entity.metadata.recordId.entityId}
        >
          {entity.metadata.recordId.entityId}
        </option>
      )),
    [filteredEntities],
  );

  const entityTypeFilter = (
    <select
      onChange={(changeEvent) => {
        const entityTypeId = changeEvent.target.value as
          | VersionedUrl
          | undefined;
        setSelectedEntityTypeIdFilter(entityTypeId ?? null);
      }}
    >
      <option value={undefined} selected={selectedEntityTypeIdFilter === null}>
        {entityTypeIdOptions.length === 0
          ? "No entities to delete"
          : "Select an entity type to filter by"}
      </option>
      {entityTypeIdOptions}
    </select>
  );

  /* @todo - parseEntityFromLabel */
  const entityPicker = (
    <select
      onChange={(changeEvent) => {
        const entityId = changeEvent.target.value as string | undefined;
        setSelectedEntityId(entityId ?? null);
      }}
    >
      <option value={undefined} selected={selectedEntityId === null}>
        {entityTypeIdOptions.length === 0
          ? "No entities to delete"
          : "Select an entity to delete"}
      </option>
      {entityOptions}
    </select>
  );

  return (
    <div>
      {entityTypeFilter}
      {entityPicker}
      <button
        type="button"
        disabled={!selectedEntityId}
        onClick={async () => {
          if (!selectedEntityId) {
            throw new Error(
              "Implementation error, should not be able to click button without an EntityId being picked",
            );
          }
          await deleteEntity(selectedEntityId);
          setSelectedEntityId(null);
        }}
      >
        Delete
      </button>
    </div>
  );
};
