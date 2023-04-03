import * as Sentry from "@sentry/nextjs";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { SerializedUser } from "../lib/api/model/user.model";
import { setWordpressInstanceUrlSession } from "../lib/wordpress-instance-url-session";

export type UserState = SerializedUser | "loading" | undefined;

export type UserContextValue = {
  user: UserState;
  setUser: Dispatch<SetStateAction<UserState>>;
  refetch: () => Promise<void>;
};

export const UserContext = createContext<UserContextValue>({
  user: undefined,
  setUser: () => undefined,
  refetch: async () => undefined,
});

export const useUser = () => useContext(UserContext);

export const signOut = (setUser: Dispatch<SetStateAction<UserState>>) => {
  Sentry.configureScope((scope) => {
    scope.clear();
  });
  setWordpressInstanceUrlSession(null);
  setUser(undefined);
};
