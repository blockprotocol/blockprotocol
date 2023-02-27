import { createContext, useContext } from "react";

/**
 * @todo - We could improve the intention of this context further by broadcasting strongly-typed granular events
 *   (or storing granular signals) so components can subscribe to updates for specific entities, entity types, etc.
 */

export type RefreshDataProps = {
  /** Just something to hold state, which hooks can depend on / watch changes from */
  refreshSignal: boolean;
  sendRefreshSignal: () => void;
};

const RefreshDataContext = createContext<RefreshDataProps>({
  refreshSignal: false,
  sendRefreshSignal: () => {},
});

const { Provider, Consumer } = RefreshDataContext;

const useRefreshDataContext = () => useContext(RefreshDataContext);

export {
  Consumer as RefreshDataConsumer,
  RefreshDataContext,
  Provider as RefreshDataProvider,
  useRefreshDataContext,
};
