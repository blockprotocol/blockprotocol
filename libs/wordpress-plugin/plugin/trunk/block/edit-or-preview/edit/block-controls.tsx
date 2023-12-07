import { JsonObject } from "@blockprotocol/core";
import {
  EntityRootType,
  GraphEmbedderMessageCallbacks,
  Subgraph,
  VersionedUrl,
} from "@blockprotocol/graph";
import { getRoots } from "@blockprotocol/graph/stdlib";
import { BlockControls, InspectorControls } from "@wordpress/block-editor";
import { ComboboxControl, PanelBody } from "@wordpress/components";
import { lazy, Suspense, useMemo } from "react";

import { DbEntity } from "../../shared/api";
import { LoadingImage } from "./loading-image";

const generateLabel = (entity: DbEntity) =>
  `${entity.entity_type_id
    .split("/")
    .slice(-3, -2)
    .join("/")}-${entity.entity_id.slice(0, 6)}`;

const EntitySelectionRenderer = ({
  item: entity,
}: {
  item: Window["block_protocol_data"]["entities"][0];
}) => {
  return (
    // @todo change this element
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      key={entity.entity_id}
      onClick={() => {
        try {
          (document.activeElement as HTMLElement | undefined)?.blur();
        } catch {
          // activeElement was not HTMLElement
        }
      }}
    >
      <div style={{ fontSize: "12px" }}>{generateLabel(entity)}</div>
      <div style={{ fontSize: "11px" }}>
        {"Found in post: "}
        {Object.values(entity.locations).length
          ? Object.values(entity.locations).map((location) => (
              <span key={location.edit_link}>{location.title} </span>
            ))
          : "none"}
      </div>
    </div>
  );
};

const EntityEditor = lazy(() => import("./block-controls/entity-editor"));

export const CONTROLS_LOADING_IMAGE_HEIGHT = "400px";

/**
 * The entity editor for these blocks is hidden as editing their properties directly
 * may cause unexpected behavior.
 *
 * @todo allow blocks to specify which properties in their schema should be editable
 *   from outside the block itself
 */
const schemasToHideEditorFor = [
  "https://blockprotocol.org/@hash/types/entity-type/ai-image-block/",
  "https://blockprotocol.org/@hash/types/entity-type/ai-text-block/",
  "https://blockprotocol.org/@hash/types/entity-type/address-block/",
  "https://blockprotocol.org/@hash/types/entity-type/callout-block/",
  "https://blockprotocol.org/@hash/types/entity-type/heading-block/",
  "https://blockprotocol.org/@hash/types/entity-type/paragraph-block/",
  "https://blockprotocol.org/@hash/types/entity-type/shuffle-block/v/2",
  "https://blockprotocol.org/@tldraw/types/entity-type/drawing-block/",
];

const shouldEditorBeHidden = (schema: VersionedUrl) => {
  return schemasToHideEditorFor.find((option) => schema.startsWith(option));
};

export const CustomBlockControls = ({
  entityId,
  entitySubgraph,
  entityTypeId,
  setEntityId,
  updateEntity,
}: {
  entityId?: string;
  entitySubgraph: Subgraph<EntityRootType>;
  entityTypeId: VersionedUrl;
  setEntityId: (entityId: string) => void;
  updateEntity: GraphEmbedderMessageCallbacks["updateEntity"];
}) => {
  const { entities } = window.block_protocol_data;

  const options = useMemo(
    () =>
      entities
        .sort((a, b) => {
          const differenceInPagesFoundIn =
            Object.keys(b.locations).length - Object.keys(a.locations).length;
          if (differenceInPagesFoundIn !== 0) {
            return differenceInPagesFoundIn;
          }
          return generateLabel(a).localeCompare(generateLabel(b));
        })
        .map((entity) => ({
          label: generateLabel(entity),
          value: entity.entity_id,
          ...entity,
        })),
    [entities],
  );

  const entityProperties = useMemo(() => {
    const root = getRoots<EntityRootType>(entitySubgraph)?.[0];
    return root?.properties ?? {};
  }, [entitySubgraph]);

  if (!entityId) {
    return <LoadingImage height={CONTROLS_LOADING_IMAGE_HEIGHT} />;
  }

  const updateEntityProperties = (properties: JsonObject) => {
    void updateEntity({ data: { entityId, entityTypeId, properties } });
  };

  return (
    <>
      <BlockControls>
        {/* Additional buttons to show on the block toolbar go here */}
      </BlockControls>
      <InspectorControls>
        <PanelBody>
          <p>
            Have data from another Block Protocol block you want to swap into
            this one? Choose a (compatible) entity here.
          </p>
          <ComboboxControl
            // @ts-expect-error –– types are wrong, see https://developer.wordpress.org/block-editor/reference-guides/components/combobox-control/#__experimentalrenderitem
            __experimentalRenderItem={EntitySelectionRenderer}
            allowReset={false}
            label="Select entity"
            onChange={(newEntityId) => setEntityId(newEntityId!)}
            options={options}
            value={entityId}
          />
        </PanelBody>
        <PanelBody>
          {shouldEditorBeHidden(entityTypeId) ? null : (
            <Suspense
              fallback={<LoadingImage height={CONTROLS_LOADING_IMAGE_HEIGHT} />}
            >
              <p>
                In addition to the block's own UI, you can edit the data sent to
                it here.
              </p>
              <EntityEditor
                entityProperties={entityProperties}
                entityTypeId={entityTypeId}
                updateProperties={updateEntityProperties}
              />
            </Suspense>
          )}
        </PanelBody>
      </InspectorControls>
    </>
  );
};
