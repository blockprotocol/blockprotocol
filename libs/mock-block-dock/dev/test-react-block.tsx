import { Entity } from "@blockprotocol/graph";
import {
  type BlockComponent,
  useGraphBlockModule,
} from "@blockprotocol/graph/react";
import { getRoots } from "@blockprotocol/graph/stdlib";
import { useHook, useHookBlockModule } from "@blockprotocol/hook/react";
import { extractBaseUri } from "@blockprotocol/type-system/slim";
import { useMemo, useRef, useState } from "react";

import { propertyTypes } from "../src/data/property-types";

export const TestReactBlock: BlockComponent = ({ graph }) => {
  const { blockEntitySubgraph, readonly } = graph;
  const blockRef = useRef<HTMLDivElement>(null);
  const hookRef = useRef<HTMLDivElement>(null);

  const blockEntity = useMemo(() => {
    return blockEntitySubgraph ? getRoots(blockEntitySubgraph)[0]! : undefined;
  }, [blockEntitySubgraph]);

  const { graphModule } = useGraphBlockModule(blockRef);

  const { hookModule } = useHookBlockModule(blockRef);

  useHook(
    hookModule,
    hookRef,
    "text",
    blockEntity?.metadata.recordId.entityId ?? "",
    [extractBaseUri(propertyTypes.description.$id)],
    () => {
      throw new Error(
        "Fallback called – dock is not correctly handling text hook.",
      );
    },
  );

  const [entities, setEntities] = useState<Record<string, Entity>>({});

  if (readonly) {
    return (
      <div ref={blockRef}>
        <h1>
          Hello{" "}
          {
            blockEntity?.properties[extractBaseUri(propertyTypes.name.$id)] as
              | string
              | undefined
          }
          ! The id of this block is {blockEntity?.metadata.recordId.entityId}
        </h1>
        <h2>Block-handled name display</h2>
        <p style={{ marginBottom: 30 }}>
          {
            blockEntity?.properties[extractBaseUri(propertyTypes.name.$id)] as
              | string
              | undefined
          }
        </p>
        <h2>Hook-handled description display</h2>
        <div ref={hookRef} />
      </div>
    );
  }

  return (
    <div ref={blockRef}>
      <button
        onClick={async () => {
          const { data, errors } = await graphModule.createEntity({
            data: {
              entityTypeId: blockEntity!.metadata!.entityTypeId,
              properties: {
                [extractBaseUri(propertyTypes.name.$id)]: "alice",
              },
            },
          });

          if (!data) {
            console.error(errors);
            throw new Error("Failed to create entity: alice");
          }

          setEntities((prevEntities) => ({ ...prevEntities, alice: data }));
        }}
      >
        Create Alice
      </button>
      <button
        onClick={async () => {
          const { data, errors } = await graphModule.createEntity({
            data: {
              entityTypeId: blockEntity!.metadata!.entityTypeId,
              properties: {
                [extractBaseUri(propertyTypes.name.$id)]: "bob",
              },
            },
          });

          if (!data) {
            console.error(errors);
            throw new Error("Failed to create entity: bob");
          }

          setEntities((prevEntities) => ({ ...prevEntities, bob: data }));
        }}
      >
        Create Bob
      </button>
      <button
        onClick={async () => {
          const { data, errors } = await graphModule.createEntity({
            data: {
              entityTypeId: blockEntity!.metadata!.entityTypeId,
              properties: {
                [extractBaseUri(propertyTypes.name.$id)]: "charlie",
              },
            },
          });

          if (!data) {
            console.error(errors);
            throw new Error("Failed to create entity: charlie");
          }

          setEntities((prevEntities) => ({ ...prevEntities, charlie: data }));
        }}
      >
        Create Charlie
      </button>
      <button
        onClick={async () => {
          const { data, errors } = await graphModule.createEntity({
            data: {
              entityTypeId: blockEntity!.metadata!.entityTypeId,
              properties: {},
              linkData: {
                leftEntityId: entities.alice!.metadata.recordId.entityId,
                rightEntityId: entities.bob!.metadata.recordId.entityId,
              },
            },
          });

          if (!data) {
            console.error(errors);
            throw new Error(`Failed to create entity: aliceToBob`);
          }

          setEntities((prevEntities) => ({
            ...prevEntities,
            aliceToBob: data!,
          }));
        }}
      >
        Create Alice to Bob Link
      </button>
      <button
        onClick={async () => {
          const { data, errors } = await graphModule.createEntity({
            data: {
              entityTypeId: blockEntity!.metadata!.entityTypeId,
              properties: {},
              linkData: {
                leftEntityId: entities.alice!.metadata.recordId.entityId,
                rightEntityId: entities.charlie!.metadata.recordId.entityId,
              },
            },
          });

          if (!data) {
            console.error(errors);
            throw new Error(`Failed to create entity: aliceToCharlie`);
          }

          setEntities((prevEntities) => ({
            ...prevEntities,
            aliceToCharlie: data!,
          }));
        }}
      >
        Create Alice to Charlie Link
      </button>
      <button
        onClick={async () => {
          await graphModule.deleteEntity({
            data: {
              entityId: entities.aliceToBob!.metadata.recordId.entityId,
            },
          });
        }}
      >
        Delete Alice To Bob
      </button>
      <button
        onClick={async () => {
          await graphModule.deleteEntity({
            data: {
              entityId: entities.charlie!.metadata.recordId.entityId,
            },
          });
        }}
      >
        Delete Charlie
      </button>
      <h1>
        <>
          Hello{" "}
          {blockEntity?.properties[extractBaseUri(propertyTypes.name.$id)]}! The
          id of this block is {blockEntity?.metadata.recordId.entityId}
        </>
      </h1>
      <h2>Block-handled name editing</h2>
      <input
        type="text"
        placeholder="This block's entity's 'name' property"
        value={
          blockEntity?.properties[extractBaseUri(propertyTypes.name.$id)] as
            | string
            | undefined
        }
        onChange={async (event) => {
          if (!blockEntity) {
            return;
          }
          try {
            const { data, errors } = await graphModule.updateEntity({
              data: {
                entityId: blockEntity.metadata.recordId.entityId,
                entityTypeId: blockEntity.metadata.entityTypeId,
                properties: {
                  ...blockEntity.properties,
                  [extractBaseUri(propertyTypes.name.$id)]: event.target.value,
                },
                leftToRightOrder: blockEntity.linkData?.leftToRightOrder,
                rightToLeftOrder: blockEntity.linkData?.rightToLeftOrder,
              },
            });
            // eslint-disable-next-line no-console
            console.log("Return from updateEntity request: ", {
              data,
              errors,
            });
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Error calling updateEntity: ${err}`);
          }
        }}
      />
      <h2>Hook-handled description editing</h2>
      <div ref={hookRef} />
    </div>
  );
};
