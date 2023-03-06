import {
  type BlockComponent,
  useEntitySubgraph,
  useGraphBlockModule,
} from "@blockprotocol/graph/react";
import { useRef, useState } from "react";

import styles from "./base.module.scss";
import { CompanyFactory } from "./components/create-entity/company-factory";
import { LinkFactory } from "./components/create-entity/link-factory";
import { PersonFactory } from "./components/create-entity/person-factory";
import { EntityEraser } from "./components/delete-entity/entity-eraser";
import { RefreshDataProvider } from "./contexts/refresh-data";
import {
  BlockEntity,
  BlockEntityOutgoingLinkAndTarget,
} from "./types/generated/block-entity";

/**
 * This is the entry point for your block – the function that embedding applications will call to create it.
 * It is a function that takes a property object (known as "props" in React) and returns an element.
 * You should update this comment to describe what your block does, or remove the comment.
 */
export const App: BlockComponent<BlockEntity> = ({
  graph: {
    /**
     * The properties sent to the block represent the messages sent automatically from the application to the block.
     * All block <> application messages are split into modules, and so is this property object.
     * Here, we're extracting the 'graph' module messages from the property object.
     * – and then taking a single message from it, 'blockEntitySubgraph'
     * @see https://blockprotocol.org/docs/spec/graph-module#message-definitions for other such messages
     */
    blockEntitySubgraph,
  },
}) => {
  /**
   * These two lines establish communication with the embedding application.
   * You don't need to change or understand them, but if you are curious:
   * 1. we create a 'ref' which will store a reference to an element – we need an element to communicate to the app via
   *   - the ref stores 'null' at first, but will be attached to the root element in our block when it exists
   * 2. we then feed the reference to a 'hook' (a function that uses React features), which sets up the graph module:
   *   - this takes care of the lower-level details of communicating with the embedding application
   *   - it returns a 'graphModule' which has various methods on it, corresponding to messages your block can send
   *   - see an example below for sending an 'updateEntity' message, and a link to the other available messages
   */
  const blockRootRef = useRef<HTMLDivElement>(null);
  const { graphModule } = useGraphBlockModule(blockRootRef);

  const { rootEntity: _blockEntity } = useEntitySubgraph<
    BlockEntity,
    BlockEntityOutgoingLinkAndTarget[]
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
        <CompanyFactory graphModule={graphModule} />
        <LinkFactory graphModule={graphModule} />
        <EntityEraser graphModule={graphModule} />
      </div>
    </RefreshDataProvider>
  );
};
