import { BlockComponent } from "blockprotocol/react";
import * as React from "react";

type AppProps = {
  name: string;
};

export const TestBlock: BlockComponent<AppProps> = ({ entityId, name }) => {
  return (
    <div>
      Hello {name}! The id of this block is {entityId}
    </div>
  );
};
