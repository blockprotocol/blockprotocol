import {
  BlockComponent,
  useGraphBlockService,
} from "@blockprotocol/graph/react";
import { BaseUri, VersionedUri } from "@blockprotocol/type-system";
import { useCallback, useRef } from "react";

import styles from "./base.module.scss";

const BASE_URI = "http://hash.ai/@alfie/types/data-type/test";

type BlockEntityProperties = {
  uri?: VersionedUri;
};

export const App: BlockComponent<BlockEntityProperties> = ({
  graph: {
    blockEntity: { entityId, properties },
  },
}) => {
  const blockRootRef = useRef<HTMLDivElement>(null);
  const { graphService } = useGraphBlockService(blockRootRef);

  const updateSelf = useCallback(
    (newProperties: Partial<BlockEntityProperties>) =>
      graphService?.updateEntity({
        data: { properties: newProperties, entityId },
      }),
    [entityId, graphService],
  );

  let { uri } = properties;

  return (
    <div className={styles.block} ref={blockRootRef}>
      <h1>URI: {uri?.toString()}</h1>
      <button
        onClick={async () => {
          if (!uri) {
            const base_uri = new BaseUri(BASE_URI);
            uri = new VersionedUri(base_uri, 0);
          }
          await updateSelf({ uri });
        }}
        type="button"
      >
        Increment version
      </button>
    </div>
  );
};
