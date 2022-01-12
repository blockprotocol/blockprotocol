import { createContext, Dispatch, SetStateAction } from "react";
import { SerializedUser } from "../lib/model/user.model";

type UserContextProps = {
  user?: SerializedUser;
  setUser: Dispatch<SetStateAction<SerializedUser | undefined>>;
  refetch: () => void;
};

const UserContext = createContext<UserContextProps>({
  user: undefined,
  setUser: () => undefined,
  refetch: () => undefined,
});

export default UserContext;
