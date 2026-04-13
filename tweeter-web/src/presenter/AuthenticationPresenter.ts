import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface AuthenticationView extends View {
  setIsLoading: (value: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean,
  ) => void;
  navigate: (url: string) => void;
}

export abstract class AuthenticationPresenter<
  V extends AuthenticationView,
> extends Presenter<V> {
  protected userService = new UserService();

  protected async doAuthenticationOperation(
    authenticationOperation: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    navigatePath: (user: User) => string,
    operationDescription: string,
  ) {
    this.view.setIsLoading(true);

    try {
      await this.doFailureReportingOperation(async () => {
        const [user, authToken] = await authenticationOperation();

        this.view.updateUserInfo(user, user, authToken, rememberMe);
        this.view.navigate(navigatePath(user));
      }, operationDescription);
    } finally {
      this.view.setIsLoading(false);
    }
  }
}
