import {
  BlockComponent,
  useGraphBlockService,
} from "@blockprotocol/graph/react";
import { useCallback, useEffect, useRef, useState } from "react";
import init, { BaseUri, VersionedUri } from "@blockprotocol/type-system-web";
import * as wasm from "@blockprotocol/type-system-web";

global.wasm = wasm; // Make it accessible in the console for testing

import styles from "./base.module.scss";

const BASE_URI = "http://hash.ai/@alfie/types/data-type/test";

type BlockEntityProperties = {
  uri?: VersionedUri;
};

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const App: BlockComponent<BlockEntityProperties> = ({
  graph: {
    blockEntity: { entityId, properties },
  },
}) => {
  const [initialized, setInitialized] = useState(false);
  const blockRootRef = useRef<HTMLDivElement>(null);
  const { graphService } = useGraphBlockService(blockRootRef);

  useEffect(() => {
    if (!initialized) {
      init().then(() => {
        setInitialized(true);
      });
    }
  }, [initialized, setInitialized]);

  const updateSelf = useCallback(
    (newProperties: Partial<BlockEntityProperties>) =>
      graphService?.updateEntity({
        data: { properties: newProperties, entityId },
      }),
    [entityId, graphService],
  );

  let { uri } = properties;

  if (!initialized) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className={styles.block} ref={blockRootRef}>
        <h1>URI: {uri?.toString()}</h1>
        <button
          onClick={async () => {
            if (!uri) {
              const baseUri = new BaseUri(BASE_URI);
              uri = new VersionedUri(baseUri, getRandomInt(1000));
            }
            if (uri) {
              uri = new VersionedUri(uri.baseUri, getRandomInt(1000));
            }

            await updateSelf({ uri });
          }}
          type="button"
        >
          Increment version
        </button>
      </div>
    );
  }
};
