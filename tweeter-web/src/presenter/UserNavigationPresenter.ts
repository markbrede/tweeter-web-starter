import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserNavigationView {
  setDisplayedUser: (user: User) => void;
  navigate: (url: string) => void;
  displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter {
  private _view: UserNavigationView;
  private userService: UserService;

  constructor(view: UserNavigationView) {
    this._view = view;
    this.userService = new UserService();
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  public async navigateToUser(
    authToken: AuthToken,
    displayedUser: User,
    href: string,
  ) {
    try {
      const alias = this.extractAlias(href);

      const toUser = await this.userService.getUser(authToken, alias);

      if (toUser && !toUser.equals(displayedUser)) {
        const match = href.match(/^\/([^/]+)/);
        const featurePath = match ? `/${match[1]}` : "";

        this._view.setDisplayedUser(toUser);
        this._view.navigate(`${featurePath}/${toUser.alias}`);
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`,
      );
    }
  }
}
