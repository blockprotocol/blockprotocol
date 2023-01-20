import {
  type BlockComponent,
  useGraphBlockService,
} from "@blockprotocol/graph/react";
import { getRoots } from "@blockprotocol/graph/stdlib";
import { useHook, useHookBlockService } from "@blockprotocol/hook/react";
import { extractBaseUri } from "@blockprotocol/type-system/slim";
import { useMemo, useRef } from "react";

import { propertyTypes } from "../src/data/property-types";

export const TestReactBlock: BlockComponent = ({ graph }) => {
  const { blockEntitySubgraph, readonly } = graph;
  const blockRef = useRef<HTMLDivElement>(null);
  const hookRef = useRef<HTMLDivElement>(null);

  const blockEntity = useMemo(() => {
    return blockEntitySubgraph ? getRoots(blockEntitySubgraph)[0]! : undefined;
  }, [blockEntitySubgraph]);

  const { graphService } = useGraphBlockService(blockRef);

  const { hookService } = useHookBlockService(blockRef);

  useHook(
    hookService,
    hookRef,
    "text",
    blockEntity?.metadata.recordId.baseId ?? "",
    "$.description",
    () => {
      throw new Error(
        "Fallback called – dock is not correctly handling text hook.",
      );
    },
  );

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
          ! The id of this block is {blockEntity?.metadata.recordId.baseId}
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
      <h1>
        <>
          Hello{" "}
          {blockEntity?.properties[extractBaseUri(propertyTypes.name.$id)]}! The
          id of this block is {blockEntity?.metadata.recordId.baseId}
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
            const { data, errors } = await graphService!.updateEntity({
              data: {
                entityId: blockEntity.metadata.recordId.baseId,
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
