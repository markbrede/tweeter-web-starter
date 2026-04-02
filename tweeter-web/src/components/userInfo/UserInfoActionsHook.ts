import { useContext } from "react";
import { UserInfoActionsContext } from "./UserInfoContexts";
import { User, AuthToken } from "tweeter-shared";

interface UserInfoActions {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  clearUserInfo: () => void;
  setDisplayedUser: (user: User) => void;
}

export const useUserInfoActions = (): UserInfoActions => {
  return useContext(UserInfoActionsContext);
};
