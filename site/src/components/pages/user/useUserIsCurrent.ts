import { useMemo } from "react";
import { useUser } from "../../../context/UserContext";
import { SerializedUser } from "../../../lib/api/model/user.model";

export const useUserIsCurrent = (user: SerializedUser) => {
  const { user: currentUser } = useUser();

  const result = useMemo(() => {
    if (currentUser !== "loading" && currentUser) {
      return currentUser.id === user.id;
    }
    return false;
  }, [user, currentUser]);

  return result;
};
