import { Message } from "@blockprotocol/core";
import { EntityType } from "@blockprotocol/graph/.";
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

type MockBlockDockInfo = {
  debugMode: boolean;
  setDebugMode: Dispatch<SetStateAction<boolean>>;
  logs: Message[];
  setLogs: Dispatch<SetStateAction<Message[]>>;
  readonly: boolean;
  setReadonly: Dispatch<SetStateAction<boolean>>;
  blockSchema?: Partial<EntityType>;
  setBlockSchema: Dispatch<SetStateAction<Partial<EntityType>>>;
};

const MockBlockDockContext = createContext<MockBlockDockInfo>({
  debugMode: false,
  setDebugMode: () => {},
  logs: [],
  setLogs: () => {},
  readonly: false,
  setReadonly: () => {},
  setBlockSchema: () => {},
});

type Props = {
  children: ReactNode;
  debugMode: boolean;
  setDebugMode: Dispatch<SetStateAction<boolean>>;
  readonly: boolean;
  setReadonly: Dispatch<SetStateAction<boolean>>;
  blockSchema: Partial<EntityType>;
  setBlockSchema: Dispatch<SetStateAction<Partial<EntityType>>>;
};

export const MockBlockDockProvider = ({
  children,
  debugMode,
  setDebugMode,
  readonly,
  setReadonly,
  blockSchema,
  setBlockSchema,
}: Props) => {
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
      debugMode,
      setDebugMode,
      logs,
      setLogs,
      readonly,
      setReadonly,
      blockSchema,
      setBlockSchema,
    };
  }, [
    debugMode,
    setDebugMode,
    logs,
    readonly,
    setReadonly,
    blockSchema,
    setBlockSchema,
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
