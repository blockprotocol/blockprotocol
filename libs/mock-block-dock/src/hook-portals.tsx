import { HookData } from "@blockprotocol/hook";
import { useCallback, useMemo } from "react";
import { createPortal } from "react-dom";

import { TextHookView } from "./hook-portals/text";
import { useMockBlockDockContext } from "./mock-block-dock-context";
import { get, set } from "./util";

const HookPortal = ({ entityId, path, type }: HookData) => {
  const { datastore, readonly, updateEntity } = useMockBlockDockContext();

  const { entity, value } = useMemo(() => {
    const foundEntity = datastore.entities.find(
      (currentEntity) => currentEntity.entityId === entityId,
    );

    if (!foundEntity) {
      throw new Error(
        `Could not find entity requested by hook with entityId '${entityId}' in datastore.`,
      );
    }

    const foundValue = get(
      foundEntity.properties,
      path.replace(/^\$\./, ""), // remove json path root identifier '$.'
      undefined,
    );

    return { entity: foundEntity, value: foundValue };
  }, [datastore.entities, entityId, path]);

  const updateValue = useCallback(
    async (newValue: unknown) => {
      const newProperties = { ...entity?.properties };

      set(newProperties, path, newValue);

      return updateEntity({
        data: { entityId, properties: newProperties },
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
