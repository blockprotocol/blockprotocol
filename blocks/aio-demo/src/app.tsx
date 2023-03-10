import {
  type BlockComponent,
  useEntitySubgraph,
  useGraphBlockModule,
} from "@blockprotocol/graph/react";
import { useRef, useState } from "react";

import styles from "./base.module.scss";
import { LinkFactory } from "./components/create-entity/link-factory";
import { OrganizationFactory } from "./components/create-entity/organization-factory";
import { PersonFactory } from "./components/create-entity/person-factory";
import { EntityEraser } from "./components/delete-entity/entity-eraser";
import { EntityUpdater } from "./components/update-entity/entity-updater";
import { RefreshDataProvider } from "./contexts/refresh-data";
import { RootEntity, RootEntityLinkedEntities } from "./types.gen";

export const App: BlockComponent<RootEntity> = ({
  graph: {
    /**
     * Here, we're extracting the 'graph' module messages from the property object.
     * – and then taking a single message from it, 'blockEntitySubgraph'
     * @see https://blockprotocol.org/docs/spec/graph-module#message-definitions for other such messages
     */
    blockEntitySubgraph,
  },
}) => {
  /**
   * These two lines establish communication with the embedding application.
   */
  const blockRootRef = useRef<HTMLDivElement>(null);
  const { graphModule } = useGraphBlockModule(blockRootRef);

  const { rootEntity: _blockEntity } = useEntitySubgraph<
    RootEntity,
    RootEntityLinkedEntities
  >(blockEntitySubgraph);

  const [refreshSignal, setRefreshSignal] = useState(false);

  return (
    /**
     * This is the outermost element of the block. We do two things with this <div>:
     * 1. give it a class from our CSS module
     *   - the 'styles' object has properties corresponding to classes defined in base.module.scss
     * 2. attach the ref we created earlier, so that we have a reference to this element
     *   - our module helper will dispatch messages to the app from this element, and listen for responses on it
     */
    <RefreshDataProvider
      value={{
        refreshSignal,
        sendRefreshSignal: () => setRefreshSignal((prevState) => !prevState),
      }}
    >
      <div className={styles.block} ref={blockRootRef}>
        <PersonFactory graphModule={graphModule} />
        <OrganizationFactory graphModule={graphModule} />
        <LinkFactory graphModule={graphModule} />
        <EntityEraser graphModule={graphModule} />
        <EntityUpdater graphModule={graphModule} />
      </div>
    </RefreshDataProvider>
  );
};
