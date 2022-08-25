import { Message } from "@blockprotocol/core";
import { Entity, EntityType } from "@blockprotocol/graph/.";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import { MockData } from "./use-mock-block-props/use-mock-datastore";

type MockBlockDockInfo = {
  debugMode: boolean;
  setDebugMode: Dispatch<SetStateAction<boolean>>;
  logs: Message[];
  setLogs: Dispatch<SetStateAction<Message[]>>;
  readonly: boolean;
  setReadonly: Dispatch<SetStateAction<boolean>>;
  blockSchema?: Partial<EntityType>;
  setBlockSchema: Dispatch<SetStateAction<Partial<EntityType>>>;
  blockEntity?: Entity;
  setBlockEntity: Dispatch<SetStateAction<Entity>>;
  datastore: MockData;
  blockType?: "react" | "custom-element" | "html";
};

const MockBlockDockContext = createContext<MockBlockDockInfo>({
  debugMode: false,
  setDebugMode: () => {},
  logs: [],
  setLogs: () => {},
  readonly: false,
  setReadonly: () => {},
  setBlockSchema: () => {},
  setBlockEntity: () => {},
  datastore: {
    entities: [],
    links: [],
    linkedAggregationDefinitions: [],
    entityTypes: []
  }
});

type Props = {
  children: ReactNode;
  debugMode: boolean;
  setDebugMode: Dispatch<SetStateAction<boolean>>;
  readonly: boolean;
  setReadonly: Dispatch<SetStateAction<boolean>>;
  blockSchema?: Partial<EntityType>;
  setBlockSchema: Dispatch<SetStateAction<Partial<EntityType>>>;
  blockEntity?: Entity;
  setBlockEntity?: Dispatch<SetStateAction<Entity>>;
  datastore: MockData;
  blockType?: "react" | "custom-element" | "html";
};

export const MockBlockDockProvider = ({
  children,
  debugMode,
  setDebugMode,
  readonly,
  setReadonly,
  blockSchema,
  setBlockSchema,
  blockEntity,
  setBlockEntity,
  datastore,
  blockType
}: Props) => {
  const [logs, setLogs] = useState<Message[]>([]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<Message>).detail;
      setLogs(prev => [...prev, { ...detail }]);
    };

    // @todo store event name in constant or pull from CoreHandler
    window.addEventListener("blockprotocolmessage", handler);

    return () => {
      window.removeEventListener("blockprotocolmessage", handler);
    };
  }, []);

  const values = useMemo(() => {
    return {
      debugMode,
      setDebugMode,
      logs,
      setLogs,
      readonly,
      setReadonly,
      blockSchema,
      setBlockSchema,
      blockEntity,
      setBlockEntity,
      datastore,
      blockType
    };
  }, [
    debugMode,
    setDebugMode,
    logs,
    readonly,
    setReadonly,
    blockSchema,
    setBlockSchema,
    blockEntity,
    setBlockEntity,
    datastore,
    blockType
  ]);

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
