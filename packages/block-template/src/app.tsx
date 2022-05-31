import { BlockComponent } from "blockprotocol/react";
import * as React from "react";

type AppProps = {
  name: string;
};

export const App: BlockComponent<AppProps> = ({ entityId, name }) => (
  <>
    <h1>Hellodd, {name}!</h1>
    <p>
      The entityId of this block is {entityId}. Use it to update its data when
      calling updateEntities.
    </p>
  </>
);
