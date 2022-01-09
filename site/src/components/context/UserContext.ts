import { createContext } from "react";
import { SerializedUser } from "../../lib/model/user.model";

type UserContextProps = {
  user?: SerializedUser;
  refetch: () => void;
};

const UserContext = createContext<UserContextProps>({
  user: undefined,
  refetch: () => undefined,
});

export default UserContext;
