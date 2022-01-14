import type { VoidFunctionComponent } from "react";

import type { BlockProtocolProps } from "./core";

export type BlockComponent<P = {}> = VoidFunctionComponent<
  P & BlockProtocolProps
>;
