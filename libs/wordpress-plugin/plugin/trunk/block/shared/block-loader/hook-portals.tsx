import { JsonValue } from "@blockprotocol/graph";
import { HookData } from "@blockprotocol/hook";
import { RichText } from "@wordpress/block-editor";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import sanitizeHtml from "sanitize-html";

import { DbEntity, getEntity, updateEntity } from "../api";
import {
  getFromObjectByPathComponents,
  setValueInObjectByPathComponents,
} from "../util";
import { Image } from "./hook-portals/image";

const HookPortal = ({
  entityId,
  path,
  readonly,
  type,
}: HookData & { readonly: boolean }) => {
  const [entity, setEntity] = useState<DbEntity | null>(null);
  const [localValue, setLocalValue] = useState("");
  const loading = useRef<boolean>(false);

  useEffect(() => {
    if (!loading.current && (!entity || entity.entity_id !== entityId)) {
      loading.current = true;
      void getEntity(entityId).then(({ entities }) => {
        const foundEntity = entities?.find(
          (entityOption) => entityOption.entity_id === entityId,
        );
        loading.current = false;
        if (!foundEntity) {
          throw new Error(
            `Could not find entity requested by hook with entityId '${entityId}' in datastore.`,
          );
        }

        const propertyValue = getFromObjectByPathComponents(
          JSON.parse(foundEntity.properties),
          path,
        );

        if (type === "text") {
          const value = propertyValue
            ? (typeof propertyValue !== "string"
                ? (propertyValue as any).toString()
                : propertyValue
              ).replace(/\n/g, "<br>")
            : "";
          setLocalValue(value);
        } else {
          setLocalValue(typeof propertyValue === "string" ? propertyValue : "");
        }

        setEntity(foundEntity);
      });
    }
  }, [entity, entityId, path, type]);

  const updateDbValueFn = useCallback(
    async (newValue: unknown) => {
      if (!entity || readonly) {
        return;
      }

      const newProperties = JSON.parse(entity.properties);

      setValueInObjectByPathComponents(
        newProperties,
        path,
        newValue as JsonValue,
      );

      const { entity: updatedEntity } = await updateEntity(entityId, {
        properties: newProperties,
      });

      setEntity(updatedEntity);
    },
    [entity, entityId, path, readonly],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateDbValue = useCallback(
    debounce(updateDbValueFn, 1000, { maxWait: 5000 }),
    [updateDbValueFn],
  );

  if (!entity) {
    return null;
  }

  switch (type) {
    case "text":
      if (readonly) {
        return (
          <p
            /* eslint-disable-next-line react/no-danger -- value is sanitized */
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(localValue) }}
            style={{ whiteSpace: "pre-wrap" }}
          />
        );
      }
      return (
        <RichText
          onChange={(updatedValue) => {
            setLocalValue(updatedValue);
            void updateDbValue(updatedValue);
          }}
          placeholder="Enter some rich text..."
          tagName="p"
          value={localValue}
        />
      );
    case "image": {
      return (
        <Image
          mediaMetadataString={localValue}
          onChange={(mediaMetadataString) => updateDbValue(mediaMetadataString)}
          readonly={readonly}
        />
      );
    }
    default:
      throw new Error(`Hook type '${type}' not implemented.`);
  }
};

export const HookPortals = ({
  hooks,
  readonly,
}: {
  hooks: Map<string, HookData>;
  readonly: boolean;
}) => {
  return (
    <>
      {[...hooks].map(([hookId, hookData]) =>
        createPortal(
          <HookPortal key={hookId} {...hookData} readonly={readonly} />,
          hookData.node!,
        ),
      )}
    </>
  );
};
