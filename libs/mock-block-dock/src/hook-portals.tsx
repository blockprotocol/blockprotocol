import { getEntityRevision } from "@blockprotocol/graph/stdlib";
import { HookData } from "@blockprotocol/hook";
import { useCallback, useMemo } from "react";
import { createPortal } from "react-dom";

import { TextHookView } from "./hook-portals/text";
import { useMockBlockDockContext } from "./mock-block-dock-context";
import { getFromObjectByPathComponents, set } from "./util";

const HookPortal = ({ entityId, path, type }: HookData) => {
  const { graph, readonly, updateEntity } = useMockBlockDockContext();

  const { entity, value } = useMemo(() => {
    const foundEntity = getEntityRevision(graph, entityId);

    if (!foundEntity) {
      throw new Error(
        `Could not find entity requested by hook with entityId '${entityId}' in datastore.`,
      );
    }

    /** @todo - do we want to catch potential errors here? */
    /** @todo update `path` to be an array so this doesn't break on Base URIs */
    const foundValue = getFromObjectByPathComponents(
      foundEntity.properties,
      path
        .replace(/^\$\./, "") // remove json path root identifier '$.'
        .split("."),
    );

    return { entity: foundEntity, value: foundValue };
  }, [graph, entityId, path]);

  const updateValue = useCallback(
    async (newValue: unknown) => {
      const newProperties = { ...entity?.properties };

      set(newProperties, path, newValue);

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

export const HookPortals = ({ hooks }: { hooks: Map<string, HookData> }) => {
  return (
    <>
      {[...hooks].map(([hookId, hookData]) =>
        createPortal(<HookPortal key={hookId} {...hookData} />, hookData.node!),
      )}
    </>
  );
};
