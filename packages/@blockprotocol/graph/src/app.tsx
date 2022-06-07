import React from "react";

import { useGraphService } from "./react";

export const App = () => {
  const blockRef = React.useRef<HTMLDivElement>(null);

  const { graphService } = useGraphService({ ref: blockRef });

  return <div ref={blockRef} />;
};
