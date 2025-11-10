import { useContext } from "react";
import { UserInfoContext, UserInfoActionsContext } from "./UserInfoContexts";

// Returns the currentUser, displayedUser, authToken info object
export const UserInfoHook = () => {
  return useContext(UserInfoContext);
};

// Returns the updateUserInfo, clearUserInfo, setDisplayedUser actions
export const UserInfoActionsHook = () => {
  return useContext(UserInfoActionsContext);
};
