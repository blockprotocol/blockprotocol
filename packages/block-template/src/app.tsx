import { BlockComponent } from "blockprotocol/react";
import * as React from "react";

import styles from "./base.module.scss";

type AppProps = {
  name: string;
};

export const App: BlockComponent<AppProps> = ({ entityId, name }) => (
  <div className={styles.block}>
    <h1>Hello, {name}!</h1>
    <p>
      The entityId of this block is {entityId}. Use it to update its data when
      calling updateEntities.
    </p>
  </div>
);
