import {
  BlockComponent,
  useGraphBlockService,
} from "@blockprotocol/graph/react";
import { useCallback, useRef } from "react";

import styles from "./base.module.scss";

type BlockEntityProperties = {
  name: string;
};

export const App: BlockComponent<BlockEntityProperties> = ({
  graph: {
    blockEntity: { entityId, properties },
  },
}) => {
  const blockRootRef = React.useRef<HTMLDivElement>(null);
  const { graphService } = useGraphBlockService(blockRootRef);

  const updateSelf = React.useCallback(
    (newProperties: Partial<BlockEntityProperties>) =>
      graphService?.updateEntity({
        data: { properties: newProperties, entityId },
      }),
    [entityId, graphService],
  );

  const { name } = properties;

  return (
    <div className={styles.block} ref={blockRootRef}>
      <h1>Hello, {name}!</h1>
      <p>
        The entityId of this block is {entityId}. Use it to update its data,
        e.g. by calling <code>updateEntity</code>.
      </p>
      <button
        onClick={() => updateSelf({ name: Math.random().toString() })}
        type="button"
      >
        Update Name
      </button>
    </div>
  );
};
