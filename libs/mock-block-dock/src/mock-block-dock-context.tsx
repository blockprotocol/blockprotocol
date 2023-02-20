import { Message } from "@blockprotocol/core";
import {
  EntityRecordId as EntityRecordIdNonTemporal,
  EntityRootType as EntityRootTypeNonTemporal,
  GraphEmbedderMessageCallbacks as GraphEmbedderMessageCallbacksNonTemporal,
  Subgraph as SubgraphNonTemporal,
} from "@blockprotocol/graph";
import { isTemporalSubgraph } from "@blockprotocol/graph/internal";
import {
  EntityRecordId as EntityRecordIdTemporal,
  EntityRootType as EntityRootTypeTemporal,
  GraphEmbedderMessageCallbacks as GraphEmbedderMessageCallbacksTemporal,
  Subgraph as SubgraphTemporal,
} from "@blockprotocol/graph/temporal";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type MockBlockDockInfo<Temporal extends boolean> = {
  blockEntitySubgraph: Temporal extends true
    ? SubgraphTemporal<EntityRootTypeTemporal>
    : SubgraphNonTemporal<EntityRootTypeNonTemporal>;
  blockInfo: {
    blockType: {
      entryPoint?: "react" | "html" | "custom-element" | string;
    };
    displayName?: string;
    icon?: string;
    image?: string;
    name?: string;
    protocol?: string;
  };
  graph: Temporal extends true ? SubgraphTemporal : SubgraphNonTemporal;
  debugMode: boolean;
  logs: Message[];
  readonly: boolean;
  setDebugMode: Dispatch<SetStateAction<boolean>>;
  setEntityRecordIdOfEntityForBlock: Dispatch<
    SetStateAction<
      Temporal extends true ? EntityRecordIdTemporal : EntityRecordIdNonTemporal
    >
  >;
  setLogs: Dispatch<SetStateAction<Message[]>>;
  setReadonly: Dispatch<SetStateAction<boolean>>;
  updateEntity: Temporal extends true
    ? GraphEmbedderMessageCallbacksTemporal["updateEntity"]
    : GraphEmbedderMessageCallbacksNonTemporal["updateEntity"];
};

const MockBlockDockTemporalContext =
  createContext<MockBlockDockInfo<true> | null>(null);
const MockBlockDockNonTemporalContext =
  createContext<MockBlockDockInfo<false> | null>(null);

type Props<Temporal extends boolean> = Omit<
  MockBlockDockInfo<Temporal>,
  "logs" | "setLogs"
> & {
  children: ReactNode;
};

export const MockBlockDockProvider = <Temporal extends boolean>({
  children,
  ...props
}: Props<Temporal>) => {
  const [logs, setLogs] = useState<Message[]>([]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<Message>).detail;
      setLogs((prev) => [...prev, { ...detail }]);
    };

    // @todo pull event name from @blockprotocol/core package
    // it is currently not exported from there
    window.addEventListener("blockprotocolmessage", handler);

    return () => {
      window.removeEventListener("blockprotocolmessage", handler);
    };
  }, []);

  const values = useMemo(() => {
    return {
      ...props,
      logs,
      setLogs,
    };
  }, [props, logs]);

  return isTemporalSubgraph(props.graph) ? (
    <MockBlockDockTemporalContext.Provider
      value={values as MockBlockDockInfo<true>}
    >
      {children}
    </MockBlockDockTemporalContext.Provider>
  ) : (
    <MockBlockDockNonTemporalContext.Provider
      value={values as MockBlockDockInfo<false>}
    >
      {children}
    </MockBlockDockNonTemporalContext.Provider>
  );
};

export const useMockBlockDockTemporalContext = () => {
  const contextValue = useContext(MockBlockDockTemporalContext);

  if (!contextValue) {
    throw new Error("no MockBlockDockContext value has been provided");
  }

  return contextValue;
};

export const useMockBlockDockNonTemporalContext = () => {
  const contextValue = useContext(MockBlockDockNonTemporalContext);

  if (!contextValue) {
    throw new Error("no MockBlockDockContext value has been provided");
  }

  return contextValue;
};
