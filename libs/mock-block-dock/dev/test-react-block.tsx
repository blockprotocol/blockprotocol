import {
  type BlockComponent,
  useGraphBlockService,
} from "@blockprotocol/graph/react";
import { useHook, useHookBlockService } from "@blockprotocol/hook/react";
import { useEffect, useRef } from "react";

type AppProps = {
  name: string;
};

export const TestReactBlock: BlockComponent<AppProps> = ({ graph }) => {
  const {
    blockEntity: { entityId, properties },
    readonly,
  } = graph;
  const blockRef = useRef<HTMLDivElement>(null);
  const hookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("block");
  });

  const { graphService } = useGraphBlockService(blockRef);

  const { hookService } = useHookBlockService(blockRef);

  useHook(hookService, hookRef, "text", entityId, "$.description", () => {
    throw new Error(
      "Fallback called – dock is not correctly handling text hook.",
    );
  });

  if (readonly) {
    return (
      <div ref={blockRef}>
        <h1>
          Hello {properties.name}! The id of this block is {entityId}
        </h1>
        <h2>Block-handled name display</h2>
        <p style={{ marginBottom: 30 }}>{properties.name}</p>
        <h2>Hook-handled description display</h2>
        <div ref={hookRef} />
      </div>
    );
  }

  return (
    <div ref={blockRef}>
      <h1>
        Hello {properties.name}! The id of this block is {entityId}
      </h1>
      <h2>Block-handled name editing</h2>
      <input
        type="text"
        placeholder="This block's entity's 'name' property"
        value={properties.name}
        onChange={async (event) => {
          try {
            const { data, errors } = await graphService.updateEntity({
              data: {
                entityId,
                properties: { ...properties, name: event.target.value },
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
