import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "../userInfo/UserInfoHook";
import { useUserInfoActions } from "../userInfo/UserInfoActionsHook";
import { useRef } from "react";
import { UserNavigationPresenter, UserNavigationView } from "../../presenter/UserNavigationPresenter";

export const useUserNavigation = () => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();

  const navigate = useNavigate();

const view: UserNavigationView = {
  setDisplayedUser,
  navigate,
  displayErrorMessage,
};

  const presenterRef = useRef<UserNavigationPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UserNavigationPresenter(view);
  }

  const navigateToUser = (event: React.MouseEvent): void => {
    event.preventDefault();

    const href =
      (event.currentTarget as HTMLAnchorElement)?.getAttribute("href") || "";

    presenterRef.current!.navigateToUser(authToken!, displayedUser!, href);
  };

  return { navigateToUser };
};
