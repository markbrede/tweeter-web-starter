import { useContext } from "react";
import { UserInfoContext } from "./UserInfoContexts";
import { UserInfo } from "./UserInfo";

export const useUserInfo = (): UserInfo => {
  return useContext(UserInfoContext);
};
