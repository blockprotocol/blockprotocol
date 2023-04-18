import { JsonValue } from "@blockprotocol/core";
import { getEntityRevision as getEntityRevisionNonTemporal } from "@blockprotocol/graph/stdlib";
import { getEntityRevision as getEntityRevisionTemporal } from "@blockprotocol/graph/temporal/stdlib";
import { HookData } from "@blockprotocol/hook";
import { useCallback, useMemo } from "react";
import { createPortal } from "react-dom";

import { TextHookView } from "./hook-portals/text";
import {
  useMockBlockDockNonTemporalContext,
  useMockBlockDockTemporalContext,
} from "./mock-block-dock-context";
import {
  getFromObjectByPathComponents,
  setValueInObjectByPathComponents,
} from "./util";

const HookPortalNonTemporal = ({ entityId, path, type }: HookData) => {
  const { graph, readonly, updateEntity } =
    useMockBlockDockNonTemporalContext();

  const { entity, value } = useMemo(() => {
    const foundEntity = getEntityRevisionNonTemporal(graph, entityId);

    if (!foundEntity) {
      throw new Error(
        `Could not find entity requested by hook with entityId '${entityId}' in datastore.`,
      );
    }

    /** @todo - do we want to catch potential errors here? */
    const foundValue = getFromObjectByPathComponents(
      foundEntity.properties,
      path,
    );

    return { entity: foundEntity, value: foundValue };
  }, [graph, entityId, path]);

  console.log({ value });

  const updateValue = useCallback(
    async (newValue: JsonValue) => {
      const newProperties = { ...entity?.properties };

      setValueInObjectByPathComponents(newProperties, path, newValue);

      return updateEntity({
        data: {
          entityId,
          entityTypeId: entity.metadata.entityTypeId,
          properties: newProperties,
          leftToRightOrder: entity.linkData?.leftToRightOrder,
          rightToLeftOrder: entity.linkData?.rightToLeftOrder,
        },
      });
    },
    [entity, entityId, path, updateEntity],
  );

  switch (type) {
    case "text":
      return (
        <TextHookView
          readonly={readonly}
          text={value}
          updateText={updateValue}
        />
      );
    default:
      throw new Error(`Hook type '${type}' not implemented.`);
  }
};

const HookPortalTemporal = ({ entityId, path, type }: HookData) => {
  const { graph, readonly, updateEntity } = useMockBlockDockTemporalContext();

  const { entity, value } = useMemo(() => {
    const foundEntity = getEntityRevisionTemporal(graph, entityId);

    if (!foundEntity) {
      throw new Error(
        `Could not find entity requested by hook with entityId '${entityId}' in datastore.`,
      );
    }

    /** @todo - do we want to catch potential errors here? */
    const foundValue = getFromObjectByPathComponents(
      foundEntity.properties,
      path,
    );

    return { entity: foundEntity, value: foundValue };
  }, [graph, entityId, path]);

  console.log({ value });

  const updateValue = useCallback(
    async (newValue: JsonValue) => {
      const newProperties = { ...entity?.properties };

      setValueInObjectByPathComponents(newProperties, path, newValue);

      return updateEntity({
        data: {
          entityId,
          entityTypeId: entity.metadata.entityTypeId,
          properties: newProperties,
          leftToRightOrder: entity.linkData?.leftToRightOrder,
          rightToLeftOrder: entity.linkData?.rightToLeftOrder,
        },
      });
    },
    [entity, entityId, path, updateEntity],
  );

  switch (type) {
    case "text":
      return (
        <TextHookView
          readonly={readonly}
          text={value}
          updateText={updateValue}
        />
      );
    default:
      throw new Error(`Hook type '${type}' not implemented.`);
  }
};

export const HookPortals = ({
  hooks,
  temporal,
}: {
  hooks: Map<string, HookData>;
  temporal: boolean;
}) => {
  return (
    <>
      {[...hooks].map(([hookId, hookData]) =>
        createPortal(
          temporal ? (
            <HookPortalTemporal key={hookId} {...hookData} />
          ) : (
            <HookPortalNonTemporal key={hookId} {...hookData} />
          ),
          hookData.node!,
        ),
      )}
    </>
  );
};
