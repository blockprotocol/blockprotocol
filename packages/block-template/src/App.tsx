import * as React from "react";

import { BlockComponent } from "blockprotocol";

type AppProps = {
  name: string;
};

export const App: BlockComponent<AppProps> = ({ name }) => (
  <div>Hello {name}!</div>
);
