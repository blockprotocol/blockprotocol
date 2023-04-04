import * as Sentry from "@sentry/nextjs";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { SerializedUser } from "../lib/api/model/user.model";
import { setWordpressSettingsUrlSession } from "../lib/wordpress-settings-url-session";

export type UserState = SerializedUser | "loading" | undefined;

export type UserContextValue = {
  user: UserState;
  setUser: Dispatch<SetStateAction<UserState>>;
  refetch: () => Promise<void>;
  signOut: () => void;
};

export const UserContext = createContext<UserContextValue>({
  user: undefined,
  setUser: () => undefined,
  refetch: async () => undefined,
  signOut: () => {},
});

export const useUser = () => useContext(UserContext);
