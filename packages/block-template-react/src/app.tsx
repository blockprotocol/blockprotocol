import {
  BlockComponent,
  useGraphBlockService,
} from "@blockprotocol/graph/react";
import { useRef } from "react";

/**
 * This file provides some base styling for your block.
 * You can delete it and write your own, but we encourage you to keep the styling scoped, e.g.
 * - use CSS modules (this approach)
 * - use a CSS-in-JS solution
 * - use a shadow DOM
 * all of these ensure that your styling does not affect anything outside your block
 */
import styles from "./base.module.scss";

/**
 * This defines the properties of the entity your block expects to be sent.
 * This entity is available to your block on props.graph.blockEntity.
 * To change the structure of the entity your block expects, change this type.
 */
type BlockEntityProperties = {
  name: string;
};

/**
 * This function is to help illustrate a property being change when the button is pressed.
 * You can remove it when you remove the button below.
 */
const supplyRandomName = () => {
  const names = ["Alice", "Bob", "Carol", "Dave", "Erin", "Frank"];
  return names[Math.floor(Math.random() * names.length)];
};

/**
 * This is the entry point for your block – it is the component w
 */
export const App: BlockComponent<BlockEntityProperties> = ({
  graph: {
    blockEntity: { entityId, properties },
  },
}) => {
  const blockRootRef = useRef<HTMLDivElement>(null);
  const { graphService } = useGraphBlockService(blockRootRef);

  const { name } = properties;

  return (
    <div className={styles.block} ref={blockRootRef}>
      <h1>Hello, {name}!</h1>
      <p>
        The entityId of this block is {entityId}. Use it to update its data,
        e.g. by calling <code>updateEntity</code>.
      </p>
      <button
        onClick={() =>
          graphService?.updateEntity({
            data: {
              entityId,
              properties: { name: supplyRandomName() },
            },
          })
        }
        type="button"
      >
        Update Name
      </button>
    </div>
  );
};
