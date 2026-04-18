import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
  setDisplayedUser: (user: User) => void;
  navigate: (url: string) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private userService: UserService;

  constructor(view: UserNavigationView) {
    super(view);
    this.userService = new UserService();
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  public async navigateToUser(
    authToken: AuthToken | null,
    href: string,
  ) {
    await this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(href);
      const requestAuthToken = authToken ?? new AuthToken("", 0);

      const toUser = await this.userService.getUser(requestAuthToken, alias);

      if (toUser) {
        this.view.setDisplayedUser(toUser);
        this.view.navigate(href);
      }
    }, "get user");
  }
}
