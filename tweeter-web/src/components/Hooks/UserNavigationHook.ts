/*
  Non ui responsibilities in this hook:
  - looking up a user by alias
  - validating whether the alias exists
  - deciding what to do when navigation succeeds or fails
  - handling error conditions that are not part of UI rendering
  

  MVP flow after my refactor:
  - UserNavigationHook.ts (UI-facing hook only)
      -> exposes goToUser for components to call
  - UserNavigationPresenter
      -> receives alias + authToken, performs validation and logic
      -> calls...
  - UserService.getUser
      -> retrieves the user from FakeData/server, returns result up
      -> presenter sends results back to...
  - UserNavigationView interface (in my hook)
      -> performs the actual navigation or displays errors
*/


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
