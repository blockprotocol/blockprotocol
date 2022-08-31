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
  blockInfo: {
    blockType: {
      entryPoint?: "react" | "html" | "custom-element" | string;
    };
    displayName?: string;
    icon?: string;
    image?: string;
    protocol?: string;
  };
  logs: Message[];
  setLogs: Dispatch<SetStateAction<Message[]>>;
} & Omit<
  MockBlockHookResult,
  "graphServiceCallbacks" | "blockGraph" | "linkedAggregations" | "entityTypes"
>;

const MockBlockDockContext = createContext<MockBlockDockInfo | null>(null);

type Props = Omit<MockBlockDockInfo, "logs" | "setLogs"> & {
  children: ReactNode;
};

export const MockBlockDockProvider = ({ children, ...props }: Props) => {
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

  return (
    <MockBlockDockContext.Provider value={values}>
      {children}
    </MockBlockDockContext.Provider>
  );
};

export const useMockBlockDockContext = () => {
  const contextValue = useContext(MockBlockDockContext);

  if (!contextValue) {
    throw new Error("no MockBlockDockContext value has been provided");
  }

  return contextValue;
};
