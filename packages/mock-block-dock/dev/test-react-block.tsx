import { BlockComponent, useGraphBlockService } from "@blockprotocol/graph";
import { useHookBlockService, useHookRef } from "@blockprotocol/hook";
import * as React from "react";
import { useCallback, useEffect, useRef } from "react";

type AppProps = {
  name: string;
};

// @todo simplify this
export const TestReactBlock: BlockComponent<AppProps> = ({ graph }) => {
  const {
    blockEntity: { entityId, properties },
  } = graph;
  const blockRef = useRef<HTMLDivElement>(null);

  const { graphService } = useGraphBlockService(blockRef);
  const { hookService } = useHookBlockService(blockRef);

  const ref = useHookRef(hookService, properties.name);

  return (
    <div ref={blockRef}>
      <h1>
        Hello {properties.name}! The id of this block is {entityId}
      </h1>
      {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
      <h2 ref={ref} />
      <input
        type="text"
        placeholder="This block's entity's 'name' property"
        value={properties.name}
        onChange={async (event) => {
          try {
            const { data, errors } = await graphService!.updateEntity({
              data: {
                entityId,
                properties: { name: event.target.value },
              },
            });
            // eslint-disable-next-line no-console
            console.log("Return from updateEntity request: ", { data, errors });
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Error calling updateEntity: ${err}`);
          }
        }}
      />
    </div>
  );
};
