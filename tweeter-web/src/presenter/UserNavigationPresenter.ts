import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserNavigationView {
  setBusy(isBusy: boolean): void;
  showError(message: string): void;
  navigateToUser(user: User): void;
}

export class UserNavigationPresenter {
  private readonly view: UserNavigationView;
  private readonly userService: UserService;

  constructor(view: UserNavigationView, userService = new UserService()) {
    this.view = view;
    this.userService = userService;
  }

  async goToUser(authToken: AuthToken, alias: string): Promise<void> {
    if (!alias || alias[0] !== "@" || alias.length < 2) {
      this.view.showError("Alias must start with @ and include at least one character.");
      return;
    }

    this.view.setBusy(true);
    try {
      const user = await this.userService.getUser(authToken, alias);
      if (!user) {
        this.view.showError("User not found.");
        return;
      }
      this.view.navigateToUser(user);
    } catch (e: any) {
      this.view.showError(e?.message ?? "Failed to look up user.");
    } finally {
      this.view.setBusy(false);
    }
  }
}
