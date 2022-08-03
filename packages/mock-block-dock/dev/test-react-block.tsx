import {
  BlockComponent,
  useGraphBlockService,
} from "@blockprotocol/graph/react";
import { useRef } from "react";

type AppProps = {
  name: string;
};

export const TestReactBlock: BlockComponent<AppProps> = ({ graph }) => {
  const {
    blockEntity: { entityId, properties },
  } = graph;
  const blockRef = useRef<HTMLDivElement>(null);

  const { graphService } = useGraphBlockService(blockRef);

  return (
    <div ref={blockRef}>
      <h1>
        Hello {properties.name}! The id of this block is {entityId}
      </h1>
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
