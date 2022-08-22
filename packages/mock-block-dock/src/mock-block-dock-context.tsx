import { createContext, ReactNode } from "react";

type MockBlockDockInfo = {};

const MockBlockDockContext = createContext<MockBlockDockInfo>({});

export const MockBlockDockProvider = ({
  children,
  debugMode,
  setDebugMode,
}: {
  children?: ReactNode;
}) => {
  return (
    <MockBlockDockContext.Provider
      value={{
        debugMode,
        setDebugMode,
      }}
    >
      {children}
    </MockBlockDockContext.Provider>
  );
};
