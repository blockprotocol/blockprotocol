import { GraphBlockHandler, VersionedUrl } from "@blockprotocol/graph";
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useGetAllEntities } from "../../hooks/use-get-all-entities";
import { useUpdateEntity } from "../../hooks/use-update-entity";

type PersonFactoryProps = {
  graphModule: GraphBlockHandler;
};

export const EntityUpdater: FunctionComponent<PersonFactoryProps> = ({
  graphModule,
}) => {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [entityPropertiesValue, setEntityPropertiesValue] = useState("");
  const [entityTypeIdValue, setEntityTypeIdValue] = useState("");
  const [selectedEntityTypeIdFilter, setSelectedEntityTypeIdFilter] =
    useState<VersionedUrl | null>(null);

  const { updateEntity } = useUpdateEntity(graphModule);
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
          ? "No entities to update"
          : "Select an entity to update"}
      </option>
      {entityOptions}
    </select>
  );

  useEffect(() => {
    if (selectedEntityId === null) {
      return;
    }
    const selectedEntity = allEntities?.find(
      (entity) => entity.metadata.recordId.entityId === selectedEntityId,
    );

    setEntityTypeIdValue(selectedEntity?.metadata.entityTypeId as string);
    setEntityPropertiesValue(
      JSON.stringify(selectedEntity?.properties, null, 2),
    );
  }, [allEntities, selectedEntityId]);

  const isButtonDisabled = useCallback(() => {
    if (!selectedEntityId || !entityPropertiesValue) {
      return true;
    }

    try {
      JSON.parse(entityPropertiesValue);
    } catch (error) {
      return true;
    }

    return false;
  }, [selectedEntityId, entityPropertiesValue]);

  return (
    <div>
      <p>Update entity</p>
      {entityTypeFilter}
      {entityPicker}
      <input
        type="text"
        value={entityTypeIdValue}
        onChange={(event) => setEntityPropertiesValue(event.target.value)}
        style={{ display: "block", width: "768px" }}
      />
      <textarea
        value={entityPropertiesValue}
        onChange={(event) => {
          setEntityPropertiesValue(event.target.value);
        }}
        style={{ display: "block", height: "150px", width: "768px" }}
      />
      <button
        type="button"
        disabled={isButtonDisabled()}
        style={{
          cursor: isButtonDisabled() ? "not-allowed" : "pointer",
        }}
        onClick={async () => {
          if (!selectedEntityId) {
            throw new Error(
              "Implementation error, should not be able to click button without an EntityId being picked",
            );
          }
          await updateEntity({
            entityId: selectedEntityId,
            entityTypeId: entityTypeIdValue,
            properties: JSON.parse(entityPropertiesValue),
          });
          setSelectedEntityId(null);
        }}
      >
        Update
      </button>
    </div>
  );
};
