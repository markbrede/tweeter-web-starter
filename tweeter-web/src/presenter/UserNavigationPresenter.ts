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

        this.view.setDisplayedUser(toUser);
        this.view.navigate(`${featurePath}/${toUser.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`,
      );
    }
  }
}
