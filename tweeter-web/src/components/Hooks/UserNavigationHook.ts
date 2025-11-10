import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { UserInfoActionsHook } from "../userInfo/UserInfoHooks";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenter/UserNavigationPresenter";

type PresenterFactory = (view: UserNavigationView) => UserNavigationPresenter;

export function UseUserNavigationHook(presenterFactory?: PresenterFactory) {
  const [isBusy, setIsBusy] = useState(false);
  const { displayErrorMessage } = useMessageActions();
  const { setDisplayedUser } = UserInfoActionsHook();
  const navigate = useNavigate();

  // View implementation (listener), ui only mappings
  const listener: UserNavigationView = {
    setBusy: (busy: boolean) => setIsBusy(busy),
    showError: (message: string) => displayErrorMessage(message),
    navigateToUser: (user: User) => {
      setDisplayedUser(user);
      const aliasNoAt = user.alias.startsWith("@")
        ? user.alias.substring(1)
        : user.alias;
      navigate(`/user/${aliasNoAt}`);
    },
  };

  const presenterRef = useRef<UserNavigationPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = presenterFactory
      ? presenterFactory(listener)
      : new UserNavigationPresenter(listener);
  }

  const goToUser = useCallback(
    async (authToken: AuthToken, alias: string) => {
      await presenterRef.current!.goToUser(authToken, alias);
    },
    []
  );

  return { goToUser, isBusy };
}
