import { useUser } from "../../../context/user-context";
import { SerializedUser } from "../../../lib/api/model/user.model";

export const useUserStatus = (
  user: SerializedUser,
): "loading" | "current" | "other" => {
  const { user: currentUser } = useUser();
  if (currentUser === "loading") {
    return "loading";
  }

  return currentUser?.id === user.id ? "current" : "other";
};
