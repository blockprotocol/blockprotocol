import { BlockComponent } from "@blockprotocol/graph";
import * as React from "react";

type AppProps = {
  name: string;
};

export const App: BlockComponent<AppProps> = ({
  graph: {
    blockEntity: { entityId, properties },
  },
}) => {
  const { name } = properties;

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>
        The entityId of this block is {entityId}. Use it to update its data,
        e.g. by calling <code>updateEntity</code>.
      </p>
    </div>
  );
};
