import { Message } from "@blockprotocol/core";
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

import { MockBlockHookResult } from "./use-mock-block-props";

type MockBlockDockInfo = {
  blockType?: "react" | "custom-element" | "html";
  blockName?: string;
  logs: Message[];
  setLogs: Dispatch<SetStateAction<Message[]>>;
} & Omit<
  MockBlockHookResult,
  "graphServiceCallbacks" | "blockGraph" | "linkedAggregations" | "entityTypes"
>;

const MockBlockDockContext = createContext<MockBlockDockInfo>({
  debugMode: false,
  setDebugMode: () => {},
  logs: [],
  setLogs: () => {},
  readonly: false,
  setReadonly: () => {},
  setBlockSchema: () => {},
  setBlockEntity: () => {},
  blockEntity: {
    entityId: "",
    entityTypeId: "",
    properties: {},
  },
  datastore: {
    entities: [],
    links: [],
    linkedAggregationDefinitions: [],
    entityTypes: [],
  },
});

type Props = Omit<MockBlockDockInfo, "logs" | "setLogs"> & {
  children: ReactNode;
  blockType?: "react" | "custom-element" | "html";
};

export const MockBlockDockProvider = ({ children, ...props }: Props) => {
  const [logs, setLogs] = useState<Message[]>([]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<Message>).detail;
      setLogs((prev) => [...prev, { ...detail }]);
    };

    // @todo store event name in constant or pull from CoreHandler
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

  return (
    <MockBlockDockContext.Provider value={values}>
      {children}
    </MockBlockDockContext.Provider>
  );
};

export const useMockBlockDockContext = () => {
  const contextValue = useContext(MockBlockDockContext);

  return contextValue;
};
