import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { SerializedUser } from "../lib/api/model/user.model.js";

export type UserState = SerializedUser | "loading" | undefined;

export type UserContextValue = {
  user: UserState;
  setUser: Dispatch<SetStateAction<UserState>>;
  refetch: () => void;
};

export const UserContext = createContext<UserContextValue>({
  user: undefined,
  setUser: () => undefined,
  refetch: () => undefined,
});

export const useUser = () => useContext(UserContext);
